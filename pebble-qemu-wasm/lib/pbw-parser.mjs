/**
 * PBW parser — extracts and parses a Pebble PBW (ZIP) file.
 *
 * A PBW is a ZIP containing:
 *   manifest.json (per-platform)
 *   <platform>/pebble-app.bin (app binary)
 *   <platform>/app_resources.pbpack (optional)
 *   <platform>/worker.bin (optional)
 *   appinfo.json (universal)
 *
 * Platform search order for emery: emery/ → basalt/ → root
 */

import { unzipSync } from 'fflate';

// Platform prefix search order (from libpebble2/util/bundle.py)
const PLATFORM_PATHS = {
  emery: ['emery/', 'basalt/', ''],
  basalt: ['basalt/', ''],
  aplite: ['aplite/', ''],
  chalk: ['chalk/'],
  diorite: ['diorite/', 'aplite/', ''],
};

const UNIVERSAL_FILES = new Set(['appinfo.json', 'pebble-js-app.js']);

/**
 * Find a file in the ZIP using platform prefix search order.
 * @param {Object} files - fflate unzipped files map
 * @param {string} filename - Target filename (e.g. 'manifest.json')
 * @param {string} platform - Target platform
 * @returns {Uint8Array|null}
 */
function findFile(files, filename, platform) {
  if (UNIVERSAL_FILES.has(filename)) {
    return files[filename] || null;
  }
  const prefixes = PLATFORM_PATHS[platform] || PLATFORM_PATHS.emery;
  for (const prefix of prefixes) {
    const path = prefix + filename;
    if (files[path]) return files[path];
  }
  return null;
}

/**
 * Find the platform prefix that contains manifest.json.
 * @param {Object} files
 * @param {string} platform
 * @returns {string|null}
 */
function findPlatformPrefix(files, platform) {
  const prefixes = PLATFORM_PATHS[platform] || PLATFORM_PATHS.emery;
  for (const prefix of prefixes) {
    if (files[prefix + 'manifest.json']) return prefix;
  }
  return null;
}

/**
 * Parse the app binary header to extract metadata.
 * Matches libpebble2/util/bundle.py STRUCT_DEFINITION.
 *
 * @param {Uint8Array} binary - App binary data
 * @returns {Object} Parsed metadata
 */
function parseAppBinaryHeader(binary) {
  if (binary.length < 120) {
    throw new Error(`App binary too short: ${binary.length} bytes, need at least 120`);
  }
  const view = new DataView(binary.buffer, binary.byteOffset, binary.byteLength);

  // All fields are little-endian (ARM)
  const sentinel = new TextDecoder().decode(binary.subarray(0, 8)).replace(/\0/g, '');
  const structVersionMajor = binary[8];
  const structVersionMinor = binary[9];
  const sdkVersionMajor = binary[10];
  const sdkVersionMinor = binary[11];
  const appVersionMajor = binary[12];
  const appVersionMinor = binary[13];
  const appSize = view.getUint16(14, true);
  const offset = view.getUint32(16, true);
  const crc = view.getUint32(20, true);
  const appName = new TextDecoder().decode(binary.subarray(24, 56)).replace(/\0/g, '');
  const companyName = new TextDecoder().decode(binary.subarray(56, 88)).replace(/\0/g, '');
  const iconResourceId = view.getUint32(88, true);
  const symbolTableAddr = view.getUint32(92, true);
  const flags = view.getUint32(96, true);
  const numRelocationEntries = view.getUint32(100, true);

  // UUID is 16 raw bytes at offset 104
  const uuid = new Uint8Array(binary.buffer, binary.byteOffset + 104, 16);

  return {
    sentinel,
    structVersionMajor, structVersionMinor,
    sdkVersionMajor, sdkVersionMinor,
    appVersionMajor, appVersionMinor,
    appSize, offset, crc,
    appName, companyName,
    iconResourceId, symbolTableAddr,
    flags, numRelocationEntries,
    uuid: new Uint8Array(uuid), // copy to avoid dangling reference
  };
}

/**
 * @typedef {Object} ParsedPBW
 * @property {Object} manifest - Parsed manifest.json
 * @property {Object} appInfo - Parsed appinfo.json (if present)
 * @property {Object} header - Parsed app binary header metadata
 * @property {Uint8Array} appBinary - App executable binary
 * @property {Uint8Array|null} resourcesBinary - Resource pack (null if absent)
 * @property {Uint8Array|null} workerBinary - Worker binary (null if absent)
 * @property {Uint8Array} uuid - 16-byte UUID from binary header
 * @property {string} appName - App name from binary header
 * @property {string} platform - Platform prefix used
 */

/**
 * Parse a PBW file from an ArrayBuffer.
 *
 * @param {ArrayBuffer} buffer - PBW file contents
 * @param {string} [platform='emery'] - Target platform
 * @returns {ParsedPBW}
 * @throws {Error} On malformed or incomplete PBW
 */
export function parsePBW(buffer, platform = 'emery') {
  // Unzip
  const data = new Uint8Array(buffer);
  let files;
  try {
    files = unzipSync(data);
  } catch (e) {
    throw new Error(`Failed to unzip PBW: ${e.message}`);
  }

  // Find platform prefix
  const prefix = findPlatformPrefix(files, platform);
  if (prefix === null) {
    throw new Error(`No manifest.json found for platform "${platform}"`);
  }

  // Parse manifest
  const manifestBytes = files[prefix + 'manifest.json'];
  let manifest;
  try {
    manifest = JSON.parse(new TextDecoder().decode(manifestBytes));
  } catch (e) {
    throw new Error(`Failed to parse manifest.json: ${e.message}`);
  }

  if (!manifest.application) {
    throw new Error('manifest.json missing "application" key — not an app bundle');
  }

  // Extract app binary
  const appPath = prefix + manifest.application.name;
  const appBinary = files[appPath];
  if (!appBinary) {
    throw new Error(`App binary not found at "${appPath}"`);
  }

  // Parse binary header
  const header = parseAppBinaryHeader(appBinary);

  // Extract resources (optional)
  let resourcesBinary = null;
  if (manifest.resources) {
    const resPath = prefix + manifest.resources.name;
    resourcesBinary = files[resPath] || null;
  }

  // Extract worker (optional)
  let workerBinary = null;
  if (manifest.worker) {
    const workerPath = prefix + manifest.worker.name;
    workerBinary = files[workerPath] || null;
  }

  // Parse appinfo.json (optional, universal)
  let appInfo = null;
  if (files['appinfo.json']) {
    try {
      appInfo = JSON.parse(new TextDecoder().decode(files['appinfo.json']));
    } catch {
      // Non-fatal
    }
  }

  return {
    manifest,
    appInfo,
    header,
    appBinary,
    resourcesBinary,
    workerBinary,
    uuid: header.uuid,
    appName: header.appName,
    platform: prefix,
  };
}

export { parseAppBinaryHeader, findFile, findPlatformPrefix };
