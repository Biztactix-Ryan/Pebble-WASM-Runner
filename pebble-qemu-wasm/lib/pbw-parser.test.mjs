/**
 * Tests for PBW parser — creates synthetic PBW files for testing.
 *
 * Run: node lib/pbw-parser.test.mjs
 */

import { zipSync } from 'fflate';
import { parsePBW, parseAppBinaryHeader } from './pbw-parser.mjs';

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (!condition) {
    console.error(`  FAIL: ${msg}`);
    failed++;
  } else {
    console.log(`  ok: ${msg}`);
    passed++;
  }
}

/**
 * Create a minimal app binary with a valid header.
 * Matches libpebble2/util/bundle.py STRUCT_DEFINITION.
 */
function makeAppBinary(opts = {}) {
  const {
    appName = 'TestApp',
    companyName = 'TestCo',
    uuid = new Uint8Array([0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0A,0x0B,0x0C,0x0D,0x0E,0x0F,0x10]),
    flags = 0,
    iconResourceId = 1,
    sdkVersionMajor = 5,
    sdkVersionMinor = 86,
    appVersionMajor = 1,
    appVersionMinor = 0,
  } = opts;

  const buf = new ArrayBuffer(120);
  const view = new DataView(buf);
  const bytes = new Uint8Array(buf);

  // Sentinel
  const enc = new TextEncoder();
  bytes.set(enc.encode('PBLAPP\0\0'), 0);

  // Struct version
  bytes[8] = 16; bytes[9] = 1;
  // SDK version
  bytes[10] = sdkVersionMajor; bytes[11] = sdkVersionMinor;
  // App version
  bytes[12] = appVersionMajor; bytes[13] = appVersionMinor;
  // Size
  view.setUint16(14, 120, true);
  // Offset
  view.setUint32(16, 0, true);
  // CRC
  view.setUint32(20, 0x12345678, true);
  // App name (32 bytes)
  bytes.set(enc.encode(appName).slice(0, 32), 24);
  // Company name (32 bytes)
  bytes.set(enc.encode(companyName).slice(0, 32), 56);
  // Icon resource ID
  view.setUint32(88, iconResourceId, true);
  // Symbol table addr
  view.setUint32(92, 0, true);
  // Flags
  view.setUint32(96, flags, true);
  // Num relocation entries
  view.setUint32(100, 0, true);
  // UUID
  bytes.set(uuid, 104);

  return bytes;
}

/**
 * Create a synthetic PBW ZIP with the given components.
 */
function makePBW(opts = {}) {
  const {
    platform = 'emery',
    appName = 'TestApp',
    hasResources = false,
    hasWorker = false,
    includeAppInfo = true,
    binaryOpts = {},
  } = opts;

  const appBin = makeAppBinary({ appName, ...binaryOpts });
  const prefix = platform + '/';

  const manifest = {
    application: { name: 'pebble-app.bin' },
  };
  if (hasResources) {
    manifest.resources = { name: 'app_resources.pbpack' };
  }
  if (hasWorker) {
    manifest.worker = { name: 'worker.bin' };
  }

  const files = {};
  files[prefix + 'manifest.json'] = new TextEncoder().encode(JSON.stringify(manifest));
  files[prefix + 'pebble-app.bin'] = appBin;
  if (hasResources) {
    files[prefix + 'app_resources.pbpack'] = new Uint8Array([0xDE, 0xAD]);
  }
  if (hasWorker) {
    files[prefix + 'worker.bin'] = new Uint8Array([0xBE, 0xEF]);
  }
  if (includeAppInfo) {
    files['appinfo.json'] = new TextEncoder().encode(JSON.stringify({
      uuid: '01020304-0506-0708-090a-0b0c0d0e0f10',
      shortName: appName,
    }));
  }

  const zipped = zipSync(files);
  return zipped.buffer;
}

// ================================================================
// parseAppBinaryHeader
// ================================================================
console.log('\n--- parseAppBinaryHeader ---');

{
  const uuid = new Uint8Array([0xA0,0xA1,0xA2,0xA3,0xA4,0xA5,0xA6,0xA7,0xA8,0xA9,0xAA,0xAB,0xAC,0xAD,0xAE,0xAF]);
  const bin = makeAppBinary({ appName: 'MyApp', companyName: 'MyCo', uuid, flags: 0x42, iconResourceId: 7 });
  const hdr = parseAppBinaryHeader(bin);

  assert(hdr.sentinel === 'PBLAPP', 'Sentinel = PBLAPP');
  assert(hdr.appName === 'MyApp', 'appName = MyApp');
  assert(hdr.companyName === 'MyCo', 'companyName = MyCo');
  assert(hdr.flags === 0x42, 'flags = 0x42');
  assert(hdr.iconResourceId === 7, 'iconResourceId = 7');
  assert(hdr.sdkVersionMajor === 5, 'sdkVersionMajor = 5');
  assert(hdr.sdkVersionMinor === 86, 'sdkVersionMinor = 86');
  assert(hdr.uuid.length === 16, 'UUID is 16 bytes');
  assert(hdr.uuid[0] === 0xA0, 'UUID first byte correct');
  assert(hdr.uuid[15] === 0xAF, 'UUID last byte correct');
}

// Too short
{
  let threw = false;
  try { parseAppBinaryHeader(new Uint8Array(50)); } catch { threw = true; }
  assert(threw, 'Throws on short binary');
}

// ================================================================
// parsePBW — basic app only
// ================================================================
console.log('\n--- parsePBW (app only) ---');

{
  const buffer = makePBW({ appName: 'Hello' });
  const pbw = parsePBW(buffer, 'emery');

  assert(pbw.appName === 'Hello', 'appName = Hello');
  assert(pbw.uuid.length === 16, 'UUID is 16 bytes');
  assert(pbw.appBinary instanceof Uint8Array, 'appBinary is Uint8Array');
  assert(pbw.appBinary.length === 120, 'appBinary is 120 bytes');
  assert(pbw.resourcesBinary === null, 'No resources');
  assert(pbw.workerBinary === null, 'No worker');
  assert(pbw.manifest.application.name === 'pebble-app.bin', 'Manifest app name');
  assert(pbw.appInfo !== null, 'appInfo parsed');
  assert(pbw.platform === 'emery/', 'Platform prefix = emery/');
}

// ================================================================
// parsePBW — app + resources + worker
// ================================================================
console.log('\n--- parsePBW (app + resources + worker) ---');

{
  const buffer = makePBW({ appName: 'FullApp', hasResources: true, hasWorker: true });
  const pbw = parsePBW(buffer, 'emery');

  assert(pbw.resourcesBinary !== null, 'Resources present');
  assert(pbw.resourcesBinary[0] === 0xDE, 'Resources data correct');
  assert(pbw.workerBinary !== null, 'Worker present');
  assert(pbw.workerBinary[0] === 0xBE, 'Worker data correct');
}

// ================================================================
// parsePBW — platform fallback
// ================================================================
console.log('\n--- parsePBW (platform fallback) ---');

{
  // Create a PBW with basalt/ prefix, request emery
  // emery search order: emery/ → basalt/ → root
  const buffer = makePBW({ platform: 'basalt', appName: 'Fallback' });
  const pbw = parsePBW(buffer, 'emery');

  assert(pbw.appName === 'Fallback', 'Found via basalt/ fallback');
  assert(pbw.platform === 'basalt/', 'Platform prefix = basalt/');
}

// ================================================================
// parsePBW — error cases
// ================================================================
console.log('\n--- parsePBW (errors) ---');

{
  // Not a ZIP
  let threw = false;
  try { parsePBW(new ArrayBuffer(10)); } catch (e) { threw = e.message.includes('unzip'); }
  assert(threw, 'Throws on non-ZIP data');
}

{
  // ZIP without manifest
  const files = { 'random.txt': new TextEncoder().encode('hello') };
  const zipped = zipSync(files);
  let threw = false;
  try { parsePBW(zipped.buffer); } catch (e) { threw = e.message.includes('manifest'); }
  assert(threw, 'Throws on missing manifest');
}

{
  // Manifest without application key
  const files = {
    'emery/manifest.json': new TextEncoder().encode(JSON.stringify({ firmware: {} })),
  };
  const zipped = zipSync(files);
  let threw = false;
  try { parsePBW(zipped.buffer); } catch (e) { threw = e.message.includes('application'); }
  assert(threw, 'Throws on non-app manifest');
}

// ================================================================
// parsePBW — no appinfo.json
// ================================================================
console.log('\n--- parsePBW (no appinfo) ---');

{
  const buffer = makePBW({ appName: 'NoInfo', includeAppInfo: false });
  const pbw = parsePBW(buffer, 'emery');
  assert(pbw.appInfo === null, 'appInfo is null when missing');
}

// ================================================================
// Header field extraction for metadata converter
// ================================================================
console.log('\n--- Header fields for metadata ---');

{
  const buffer = makePBW({
    appName: 'MetaTest',
    binaryOpts: { flags: 0x00000041, iconResourceId: 12, sdkVersionMajor: 5, sdkVersionMinor: 86 },
  });
  const pbw = parsePBW(buffer);

  assert(pbw.header.flags === 0x41, 'Flags preserved');
  assert(pbw.header.iconResourceId === 12, 'Icon resource ID preserved');
  assert(pbw.header.sdkVersionMajor === 5, 'SDK major preserved');
  assert(pbw.header.sdkVersionMinor === 86, 'SDK minor preserved');
  assert(pbw.header.appVersionMajor === 1, 'App version major preserved');
  assert(pbw.header.appVersionMinor === 0, 'App version minor preserved');
}

// ================================================================
// Summary
// ================================================================
console.log(`\n=== ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
