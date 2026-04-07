/**
 * PutBytes protocol message construction and parsing.
 *
 * PutBytes transfers binary data (apps, resources, firmware) to the Pebble watch.
 * All multi-byte fields are big-endian. Endpoint: 0xBEEF.
 *
 * Ported from libpebble2/protocol/transfers.py and libpebble2/services/putbytes.py
 */

import { stm32Crc32 } from './stm32-crc32.mjs';

// -- Constants --

export const PUTBYTES_ENDPOINT = 0xBEEF;
export const PUTBYTES_MAX_CHUNK = 2000;

export const PutBytesCommand = {
  INIT: 0x01,
  PUT: 0x02,
  COMMIT: 0x03,
  ABORT: 0x04,
  INSTALL: 0x05,
};

export const PutBytesResult = {
  ACK: 0x01,
  NACK: 0x02,
};

export const ObjectType = {
  Firmware: 0x01,
  Recovery: 0x02,
  SystemResource: 0x03,
  AppResource: 0x04,
  AppExecutable: 0x05,
  File: 0x06,
  Worker: 0x07,
};

// -- Message builders --
// Each returns a Uint8Array of the PutBytes payload (without Pebble Protocol framing).

/**
 * Build a modern PutBytesAppInit message (v3+ firmware, app_id-based).
 * Sets bit 7 on objectType to signal the modern variant.
 *
 * Wire format: command(1) + objectSize(4 BE) + objectType(1) + appId(4 BE)
 *
 * @param {number} objectType - One of ObjectType values (e.g. AppExecutable)
 * @param {number} objectSize - Total size of the object in bytes
 * @param {number} appId - App install ID from AppFetchRequest
 * @returns {Uint8Array}
 */
export function buildPutBytesAppInit(objectType, objectSize, appId) {
  const buf = new ArrayBuffer(10);
  const view = new DataView(buf);
  view.setUint8(0, PutBytesCommand.INIT);
  view.setUint32(1, objectSize, false); // big-endian
  view.setUint8(5, objectType | 0x80); // set bit 7 for modern variant
  view.setUint32(6, appId, false);      // big-endian
  return new Uint8Array(buf);
}

/**
 * Build a legacy PutBytesInit message (v2 firmware, bank-based).
 *
 * Wire format: command(1) + objectSize(4 BE) + objectType(1) + bank(1) + filename(null-terminated)
 *
 * @param {number} objectType - One of ObjectType values
 * @param {number} objectSize - Total size of the object in bytes
 * @param {number} bank - Target bank number
 * @param {string} [filename=''] - Filename (null-terminated)
 * @returns {Uint8Array}
 */
export function buildPutBytesInit(objectType, objectSize, bank, filename = '') {
  const filenameBytes = new TextEncoder().encode(filename);
  const buf = new ArrayBuffer(7 + filenameBytes.length + 1); // +1 for null terminator
  const view = new DataView(buf);
  const bytes = new Uint8Array(buf);
  view.setUint8(0, PutBytesCommand.INIT);
  view.setUint32(1, objectSize, false); // big-endian
  view.setUint8(5, objectType);
  view.setUint8(6, bank);
  bytes.set(filenameBytes, 7);
  // null terminator is already 0 from ArrayBuffer initialization
  return bytes;
}

/**
 * Build a PutBytesPut (DATA) message.
 *
 * Wire format: command(1) + cookie(4 BE) + payloadSize(4 BE) + payload
 *
 * @param {number} cookie - Cookie from INIT response
 * @param {Uint8Array} chunkData - Payload data (max 2000 bytes)
 * @returns {Uint8Array}
 */
export function buildPutBytesPut(cookie, chunkData) {
  const buf = new ArrayBuffer(9 + chunkData.length);
  const view = new DataView(buf);
  const bytes = new Uint8Array(buf);
  view.setUint8(0, PutBytesCommand.PUT);
  view.setUint32(1, cookie, false);           // big-endian
  view.setUint32(5, chunkData.length, false);  // big-endian
  bytes.set(chunkData, 9);
  return bytes;
}

/**
 * Build a PutBytesCommit message.
 *
 * Wire format: command(1) + cookie(4 BE) + objectCrc(4 BE)
 *
 * @param {number} cookie - Cookie from INIT response
 * @param {number} objectCrc - STM32 CRC-32 of the entire object
 * @returns {Uint8Array}
 */
export function buildPutBytesCommit(cookie, objectCrc) {
  const buf = new ArrayBuffer(9);
  const view = new DataView(buf);
  view.setUint8(0, PutBytesCommand.COMMIT);
  view.setUint32(1, cookie, false);     // big-endian
  view.setUint32(5, objectCrc, false);  // big-endian
  return new Uint8Array(buf);
}

/**
 * Build a PutBytesAbort message.
 *
 * Wire format: command(1) + cookie(4 BE)
 *
 * @param {number} cookie - Cookie from INIT response
 * @returns {Uint8Array}
 */
export function buildPutBytesAbort(cookie) {
  const buf = new ArrayBuffer(5);
  const view = new DataView(buf);
  view.setUint8(0, PutBytesCommand.ABORT);
  view.setUint32(1, cookie, false); // big-endian
  return new Uint8Array(buf);
}

/**
 * Build a PutBytesInstall message.
 *
 * Wire format: command(1) + cookie(4 BE)
 *
 * @param {number} cookie - Cookie from INIT response
 * @returns {Uint8Array}
 */
export function buildPutBytesInstall(cookie) {
  const buf = new ArrayBuffer(5);
  const view = new DataView(buf);
  view.setUint8(0, PutBytesCommand.INSTALL);
  view.setUint32(1, cookie, false); // big-endian
  return new Uint8Array(buf);
}

// -- Response parser --

/**
 * Parse a PutBytesResponse.
 *
 * Wire format: result(1) + cookie(4 BE)
 *
 * @param {Uint8Array} data - Response payload (5 bytes)
 * @returns {{ result: number, cookie: number }} Parsed response
 * @throws {Error} If data is too short
 */
export function parsePutBytesResponse(data) {
  if (data.length < 5) {
    throw new Error(`PutBytesResponse too short: ${data.length} bytes, expected 5`);
  }
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  return {
    result: view.getUint8(0),
    cookie: view.getUint32(1, false), // big-endian
  };
}

// -- Re-export CRC for convenience --
export { stm32Crc32 };
