/**
 * Pebble Protocol message framing, parsing, and building.
 *
 * Pebble Protocol frames: length(2B BE) + endpoint(2B BE) + payload
 * This wraps the inner protocol messages (PutBytes, BlobDB, AppRunState, AppFetch).
 *
 * Some endpoints use big-endian (PutBytes), others use little-endian (BlobDB, AppRunState, AppFetch).
 */

// -- Endpoint constants --

export const Endpoint = {
  AppRunState: 0x0034,
  AppFetch: 0x1771,
  PutBytes: 0xBEEF,
  BlobDB: 0xB1DB,
};

// -- Pebble Protocol framing --

/**
 * Wrap a payload in a Pebble Protocol frame.
 * Frame: length(2B BE) + endpoint(2B BE) + payload
 *
 * @param {number} endpoint - Endpoint ID
 * @param {Uint8Array} payload - Message payload
 * @returns {Uint8Array} Framed message
 */
export function framePebblePacket(endpoint, payload) {
  const frame = new Uint8Array(4 + payload.length);
  const view = new DataView(frame.buffer);
  view.setUint16(0, payload.length, false); // big-endian
  view.setUint16(2, endpoint, false);       // big-endian
  frame.set(payload, 4);
  return frame;
}

/**
 * Parse a Pebble Protocol frame.
 *
 * @param {Uint8Array} data - Raw frame data
 * @returns {{ endpoint: number, payload: Uint8Array, totalLength: number }}
 * @throws {Error} If data is too short or incomplete
 */
export function parsePebblePacket(data) {
  if (data.length < 4) {
    throw new Error(`Pebble packet too short: ${data.length} bytes`);
  }
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const payloadLength = view.getUint16(0, false); // big-endian
  const endpoint = view.getUint16(2, false);
  const totalLength = 4 + payloadLength;

  if (data.length < totalLength) {
    throw new Error(`Incomplete Pebble packet: have ${data.length}, need ${totalLength}`);
  }

  return {
    endpoint,
    payload: data.subarray(4, totalLength),
    totalLength,
  };
}

// -- FEED/BEEF framing (SPP wrapper for QEMU) --

const FEED_SIGNATURE = 0xFEED;
const BEEF_SIGNATURE = 0xBEEF;
const SPP_PROTOCOL = 0x0001;

/**
 * Wrap a Pebble Protocol frame in a FEED/BEEF SPP envelope.
 * FEED/BEEF: 0xFEED(2B) + protocol(2B, 0x0001=SPP) + length(2B) + payload + 0xBEEF(2B)
 *
 * @param {Uint8Array} pebbleFrame - Complete Pebble Protocol frame
 * @returns {Uint8Array} FEED/BEEF wrapped frame
 */
export function frameFeedBeef(pebbleFrame) {
  const frame = new Uint8Array(8 + pebbleFrame.length);
  const view = new DataView(frame.buffer);
  view.setUint16(0, FEED_SIGNATURE, false);
  view.setUint16(2, SPP_PROTOCOL, false);
  view.setUint16(4, pebbleFrame.length, false);
  frame.set(pebbleFrame, 6);
  view.setUint16(6 + pebbleFrame.length, BEEF_SIGNATURE, false);
  return frame;
}

/**
 * Parse a FEED/BEEF frame, extracting the inner payload.
 *
 * @param {Uint8Array} data - Raw FEED/BEEF frame
 * @returns {{ protocol: number, payload: Uint8Array, totalLength: number }}
 * @throws {Error} On invalid header/footer or insufficient data
 */
export function parseFeedBeef(data) {
  if (data.length < 8) {
    throw new Error(`FEED/BEEF frame too short: ${data.length} bytes`);
  }
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);

  const header = view.getUint16(0, false);
  if (header !== FEED_SIGNATURE) {
    throw new Error(`Invalid FEED header: 0x${header.toString(16)}`);
  }

  const protocol = view.getUint16(2, false);
  const payloadLength = view.getUint16(4, false);
  const totalLength = 6 + payloadLength + 2; // header(6) + payload + footer(2)

  if (data.length < totalLength) {
    throw new Error(`Incomplete FEED/BEEF frame: have ${data.length}, need ${totalLength}`);
  }

  const footer = view.getUint16(6 + payloadLength, false);
  if (footer !== BEEF_SIGNATURE) {
    throw new Error(`Invalid BEEF footer: 0x${footer.toString(16)}`);
  }

  return {
    protocol,
    payload: data.subarray(6, 6 + payloadLength),
    totalLength,
  };
}

// -- AppRunState (endpoint 0x0034, little-endian) --

export const AppRunStateCommand = {
  Start: 0x01,
  Stop: 0x02,
  Request: 0x03,
};

/**
 * Build an AppRunState Start message.
 * @param {Uint8Array} uuid - 16-byte app UUID
 * @returns {Uint8Array} Payload (not framed)
 */
export function buildAppRunStateStart(uuid) {
  const buf = new Uint8Array(17); // command(1) + uuid(16)
  buf[0] = AppRunStateCommand.Start;
  buf.set(uuid, 1);
  return buf;
}

/**
 * Build an AppRunState Stop message.
 * @param {Uint8Array} uuid - 16-byte app UUID
 * @returns {Uint8Array}
 */
export function buildAppRunStateStop(uuid) {
  const buf = new Uint8Array(17);
  buf[0] = AppRunStateCommand.Stop;
  buf.set(uuid, 1);
  return buf;
}

// -- AppFetch (endpoint 0x1771, little-endian) --

export const AppFetchStatus = {
  Start: 0x01,
  Busy: 0x02,
  InvalidUUID: 0x03,
  NoData: 0x04,
};

/**
 * Parse an AppFetchRequest from the emulator.
 * Wire: command(1) + uuid(16) + app_id(int32 LE)
 *
 * @param {Uint8Array} data - Payload from endpoint 0x1771
 * @returns {{ command: number, uuid: Uint8Array, appId: number }}
 */
export function parseAppFetchRequest(data) {
  if (data.length < 21) {
    throw new Error(`AppFetchRequest too short: ${data.length} bytes, expected 21`);
  }
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  return {
    command: view.getUint8(0),
    uuid: new Uint8Array(data.buffer, data.byteOffset + 1, 16),
    appId: view.getInt32(17, true), // little-endian
  };
}

/**
 * Build an AppFetchResponse.
 * Wire: command(1) + response(1)
 *
 * @param {number} status - One of AppFetchStatus values
 * @returns {Uint8Array}
 */
export function buildAppFetchResponse(status) {
  return new Uint8Array([0x01, status]);
}

// -- BlobDB (endpoint 0xB1DB, little-endian) --

export const BlobDatabaseID = {
  Test: 0,
  Pin: 1,
  App: 2,
  Reminder: 3,
  Notification: 4,
  AppGlance: 11,
};

export const BlobDBCommand = {
  Insert: 0x01,
  Delete: 0x04,
  Clear: 0x05,
};

export const BlobStatus = {
  Success: 0x01,
  GeneralFailure: 0x02,
  InvalidOperation: 0x03,
  InvalidDatabaseID: 0x04,
  InvalidData: 0x05,
  KeyDoesNotExist: 0x06,
  DatabaseFull: 0x07,
  DataStale: 0x08,
  NotSupported: 0x09,
  Locked: 0x0A,
  TryLater: 0x0B,
};

/**
 * Build a BlobDB Insert command.
 * Wire: command(1) + token(2 LE) + database(1) + key_size(1) + key + value_size(2 LE) + value
 *
 * @param {number} token - Random uint16 for matching response
 * @param {number} databaseId - One of BlobDatabaseID values
 * @param {Uint8Array} key - Key bytes (typically 16-byte UUID)
 * @param {Uint8Array} value - Serialised value bytes
 * @returns {Uint8Array}
 */
export function buildBlobDBInsert(token, databaseId, key, value) {
  const len = 1 + 2 + 1 + 1 + key.length + 2 + value.length;
  const buf = new ArrayBuffer(len);
  const view = new DataView(buf);
  const bytes = new Uint8Array(buf);
  let offset = 0;

  view.setUint8(offset, BlobDBCommand.Insert); offset += 1;
  view.setUint16(offset, token, true); offset += 2;  // little-endian
  view.setUint8(offset, databaseId); offset += 1;
  view.setUint8(offset, key.length); offset += 1;
  bytes.set(key, offset); offset += key.length;
  view.setUint16(offset, value.length, true); offset += 2;  // little-endian
  bytes.set(value, offset);

  return bytes;
}

/**
 * Parse a BlobDB response.
 * Wire: token(2 LE) + response(1)
 *
 * @param {Uint8Array} data - Response payload
 * @returns {{ token: number, status: number }}
 */
export function parseBlobDBResponse(data) {
  if (data.length < 3) {
    throw new Error(`BlobDB response too short: ${data.length} bytes, expected 3`);
  }
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  return {
    token: view.getUint16(0, true), // little-endian
    status: view.getUint8(2),
  };
}

// -- AppMetadata serialisation (little-endian, for BlobDB insert value) --

/**
 * Serialise AppMetadata for BlobDB insertion.
 * Matches libpebble2/protocol/apps.py AppMetadata structure (little-endian).
 *
 * @param {Object} meta
 * @param {Uint8Array} meta.uuid - 16-byte UUID
 * @param {number} meta.flags - App flags (uint32)
 * @param {number} meta.icon - Icon resource ID (uint32)
 * @param {number} meta.appVersionMajor
 * @param {number} meta.appVersionMinor
 * @param {number} meta.sdkVersionMajor
 * @param {number} meta.sdkVersionMinor
 * @param {string} meta.appName - App name (max 96 chars, will be truncated)
 * @returns {Uint8Array} Serialised metadata (128 bytes)
 */
export function serialiseAppMetadata(meta) {
  // 16 (uuid) + 4 (flags) + 4 (icon) + 4 (versions) + 2 (face) + 96 (name) = 126
  const buf = new ArrayBuffer(126);
  const view = new DataView(buf);
  const bytes = new Uint8Array(buf);
  let offset = 0;

  // uuid (16 bytes)
  bytes.set(meta.uuid, offset); offset += 16;

  // flags (uint32 LE)
  view.setUint32(offset, meta.flags, true); offset += 4;

  // icon (uint32 LE)
  view.setUint32(offset, meta.icon, true); offset += 4;

  // versions (4 x uint8)
  view.setUint8(offset++, meta.appVersionMajor);
  view.setUint8(offset++, meta.appVersionMinor);
  view.setUint8(offset++, meta.sdkVersionMajor);
  view.setUint8(offset++, meta.sdkVersionMinor);

  // app_face_bg_color (uint8) + app_face_template_id (uint8)
  view.setUint8(offset++, 0);
  view.setUint8(offset++, 0);

  // app_name (96-byte fixed string, null-padded)
  const nameBytes = new TextEncoder().encode(meta.appName.slice(0, 96));
  bytes.set(nameBytes, offset);
  // remainder is already zeros from ArrayBuffer

  return bytes;
}

// -- Utility: UUID comparison --

/**
 * Compare two 16-byte UUIDs for equality.
 * @param {Uint8Array} a
 * @param {Uint8Array} b
 * @returns {boolean}
 */
export function uuidEqual(a, b) {
  if (a.length !== 16 || b.length !== 16) return false;
  for (let i = 0; i < 16; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
