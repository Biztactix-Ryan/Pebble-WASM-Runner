/**
 * PutBytes chunked transfer engine.
 *
 * Orchestrates the full INIT → PUT (chunked) → COMMIT → INSTALL flow
 * using the message builders from putbytes.mjs.
 *
 * Requires a "bridge" object that can send packets and receive responses
 * from the emulator. The bridge interface:
 *   - sendAndReceive(endpoint, payload) → Promise<Uint8Array>  (sends PP message, returns response payload)
 */

import {
  PUTBYTES_ENDPOINT,
  PUTBYTES_MAX_CHUNK,
  PutBytesResult,
  buildPutBytesAppInit,
  buildPutBytesInit,
  buildPutBytesPut,
  buildPutBytesCommit,
  buildPutBytesAbort,
  buildPutBytesInstall,
  parsePutBytesResponse,
  stm32Crc32,
} from './putbytes.mjs';

/**
 * @typedef {Object} PutBytesBridge
 * @property {(endpoint: number, payload: Uint8Array) => Promise<Uint8Array>} sendAndReceive
 */

/**
 * @typedef {Object} TransferOptions
 * @property {number} objectType - One of ObjectType values
 * @property {Uint8Array} data - The binary data to transfer
 * @property {number} [appId] - App install ID (modern path, mutually exclusive with bank)
 * @property {number} [bank] - Bank number (legacy path)
 * @property {string} [filename=''] - Filename (legacy path)
 * @property {number} [chunkSize=2000] - Max bytes per PUT chunk
 * @property {number} [timeout=15000] - Timeout per command in ms
 * @property {(sent: number, total: number) => void} [onProgress] - Progress callback
 */

class PutBytesError extends Error {
  constructor(message, phase) {
    super(message);
    this.name = 'PutBytesError';
    this.phase = phase;
  }
}

/**
 * Send a PutBytes command and parse the ACK/NACK response.
 * @param {PutBytesBridge} bridge
 * @param {Uint8Array} payload - PutBytes message payload
 * @param {number} timeout - Timeout in ms
 * @returns {Promise<{ result: number, cookie: number }>}
 */
async function sendCommand(bridge, payload, timeout) {
  const responseData = await bridge.sendAndReceive(PUTBYTES_ENDPOINT, payload, timeout);
  return parsePutBytesResponse(responseData);
}

/**
 * Assert that a PutBytes response is an ACK.
 * @param {{ result: number, cookie: number }} response
 * @param {string} phase - Description for error message
 */
function assertAck(response, phase) {
  if (response.result !== PutBytesResult.ACK) {
    throw new PutBytesError(
      `NACK received during ${phase} (result=0x${response.result.toString(16)})`,
      phase
    );
  }
}

/**
 * Execute a full PutBytes transfer: INIT → PUT (chunked) → COMMIT → INSTALL.
 *
 * @param {PutBytesBridge} bridge - Communication bridge to the emulator
 * @param {TransferOptions} options
 * @returns {Promise<void>}
 * @throws {PutBytesError} On NACK or timeout
 */
export async function putBytesTransfer(bridge, options) {
  const {
    objectType,
    data,
    appId,
    bank,
    filename = '',
    chunkSize = PUTBYTES_MAX_CHUNK,
    timeout = 15000,
    onProgress,
  } = options;

  // -- INIT --
  let initPayload;
  if (appId != null) {
    initPayload = buildPutBytesAppInit(objectType, data.length, appId);
  } else {
    initPayload = buildPutBytesInit(objectType, data.length, bank ?? 0, filename);
  }

  const initResponse = await sendCommand(bridge, initPayload, timeout);
  assertAck(initResponse, 'INIT');
  const cookie = initResponse.cookie;

  // -- PUT (chunked) --
  let sent = 0;
  try {
    while (sent < data.length) {
      const end = Math.min(sent + chunkSize, data.length);
      const chunk = data.subarray(sent, end);
      const putPayload = buildPutBytesPut(cookie, chunk);
      const putResponse = await sendCommand(bridge, putPayload, timeout);
      assertAck(putResponse, 'PUT');
      sent += chunk.length;
      if (onProgress) {
        onProgress(sent, data.length);
      }
    }

    // -- COMMIT --
    const crc = stm32Crc32(data);
    const commitPayload = buildPutBytesCommit(cookie, crc);
    const commitResponse = await sendCommand(bridge, commitPayload, timeout);
    assertAck(commitResponse, 'COMMIT');

    // -- INSTALL --
    const installPayload = buildPutBytesInstall(cookie);
    const installResponse = await sendCommand(bridge, installPayload, timeout);
    assertAck(installResponse, 'INSTALL');

  } catch (err) {
    // Attempt to abort on any error after we have a cookie
    try {
      const abortPayload = buildPutBytesAbort(cookie);
      await sendCommand(bridge, abortPayload, timeout);
    } catch {
      // Ignore abort failures
    }
    throw err;
  }
}

export { PutBytesError };
