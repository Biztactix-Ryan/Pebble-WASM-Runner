/**
 * Tests for app install orchestrator.
 * Uses mock bridge to verify the full install sequence.
 *
 * Run: node lib/app-installer.test.mjs
 */

import { zipSync } from 'fflate';
import { parsePBW } from './pbw-parser.mjs';
import { installApp, InstallError } from './app-installer.mjs';
import {
  Endpoint,
  BlobStatus,
  BlobDBCommand,
  AppFetchStatus,
  parseBlobDBResponse,
} from './pebble-protocol.mjs';
import { PutBytesCommand, PutBytesResult } from './putbytes.mjs';

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

// -- Helpers --

function makeAppBinary(opts = {}) {
  const {
    appName = 'TestApp',
    uuid = new Uint8Array([0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0A,0x0B,0x0C,0x0D,0x0E,0x0F,0x10]),
    flags = 0,
    iconResourceId = 1,
  } = opts;

  const buf = new ArrayBuffer(120);
  const view = new DataView(buf);
  const bytes = new Uint8Array(buf);
  const enc = new TextEncoder();
  bytes.set(enc.encode('PBLAPP\0\0'), 0);
  bytes[8] = 16; bytes[9] = 1;
  bytes[10] = 5; bytes[11] = 86; // SDK
  bytes[12] = 1; bytes[13] = 0;  // App version
  view.setUint16(14, 120, true);
  view.setUint32(20, 0x12345678, true);
  bytes.set(enc.encode(appName).slice(0, 32), 24);
  bytes.set(enc.encode('TestCo').slice(0, 32), 56);
  view.setUint32(88, iconResourceId, true);
  view.setUint32(96, flags, true);
  bytes.set(uuid, 104);
  return bytes;
}

function makePBW(opts = {}) {
  const { hasResources = false, hasWorker = false, uuid, appName = 'TestApp' } = opts;
  const appBin = makeAppBinary({ appName, uuid });
  const manifest = { application: { name: 'pebble-app.bin' } };
  if (hasResources) manifest.resources = { name: 'app_resources.pbpack' };
  if (hasWorker) manifest.worker = { name: 'worker.bin' };

  const files = {};
  files['emery/manifest.json'] = new TextEncoder().encode(JSON.stringify(manifest));
  files['emery/pebble-app.bin'] = appBin;
  if (hasResources) files['emery/app_resources.pbpack'] = new Uint8Array(500).fill(0xAA);
  if (hasWorker) files['emery/worker.bin'] = new Uint8Array(200).fill(0xBB);

  return zipSync(files).buffer;
}

const TEST_UUID = new Uint8Array([0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x0A,0x0B,0x0C,0x0D,0x0E,0x0F,0x10]);

/**
 * Create a mock bridge that simulates a successful install.
 * Tracks all calls and returns appropriate responses for each endpoint.
 */
function createMockBridge(opts = {}) {
  const { appId = 42, blobStatus = BlobStatus.Success, nackPutBytesAt = -1 } = opts;
  const calls = [];
  let putBytesCallIndex = 0;

  return {
    calls,
    async sendAndReceive(endpoint, payload, timeout) {
      const call = { endpoint, payload: new Uint8Array(payload) };
      calls.push(call);

      if (endpoint === Endpoint.BlobDB) {
        // BlobDB response: token(2 LE) + status(1)
        const view = new DataView(payload.buffer, payload.byteOffset);
        const token = view.getUint16(1, true); // token is at offset 1 in BlobCommand
        const resp = new Uint8Array(3);
        const rv = new DataView(resp.buffer);
        rv.setUint16(0, token, true);
        resp[2] = blobStatus;
        return resp;
      }

      if (endpoint === Endpoint.AppRunState) {
        // AppRunState doesn't have a meaningful same-endpoint response
        // Return empty or a dummy ack
        return new Uint8Array(0);
      }

      if (endpoint === Endpoint.AppFetch) {
        // AppFetch response is just acknowledged
        return new Uint8Array(0);
      }

      if (endpoint === Endpoint.PutBytes) {
        // PutBytes response: result(1) + cookie(4 BE)
        const idx = putBytesCallIndex++;
        const resp = new Uint8Array(5);
        const rv = new DataView(resp.buffer);
        rv.setUint8(0, idx === nackPutBytesAt ? PutBytesResult.NACK : PutBytesResult.ACK);
        rv.setUint32(1, 0x00000001, false); // cookie
        return resp;
      }

      return new Uint8Array(0);
    },

    async waitForMessage(endpoint, timeout) {
      if (endpoint === Endpoint.AppFetch) {
        // Simulate AppFetchRequest: command(1) + uuid(16) + app_id(4 LE)
        const buf = new Uint8Array(21);
        buf[0] = 0x01;
        buf.set(TEST_UUID, 1);
        const view = new DataView(buf.buffer);
        view.setInt32(17, appId, true);
        return buf;
      }
      throw new Error(`Unexpected waitForMessage on endpoint 0x${endpoint.toString(16)}`);
    },
  };
}

// ================================================================
// Full install — app only
// ================================================================
console.log('\n--- Full install (app only) ---');

{
  const buffer = makePBW({ uuid: TEST_UUID });
  const pbw = parsePBW(buffer);
  const bridge = createMockBridge();

  await installApp(bridge, pbw);

  // Expected calls: BlobDB + AppRunState + AppFetch response + PutBytes (INIT+PUT+COMMIT+INSTALL)
  const endpoints = bridge.calls.map(c => c.endpoint);
  assert(endpoints[0] === Endpoint.BlobDB, 'First call is BlobDB');
  assert(endpoints[1] === Endpoint.AppRunState, 'Second call is AppRunState');
  assert(endpoints[2] === Endpoint.AppFetch, 'Third call is AppFetch response');

  // Remaining calls should all be PutBytes
  const pbCalls = bridge.calls.filter(c => c.endpoint === Endpoint.PutBytes);
  assert(pbCalls.length >= 3, `At least 3 PutBytes calls (INIT+PUT+COMMIT), got ${pbCalls.length}`);

  // First PutBytes should be INIT
  assert(pbCalls[0].payload[0] === PutBytesCommand.INIT, 'First PB call is INIT');
  // Last should be INSTALL
  assert(pbCalls[pbCalls.length - 1].payload[0] === PutBytesCommand.INSTALL, 'Last PB call is INSTALL');
}

// ================================================================
// Full install — app + resources + worker
// ================================================================
console.log('\n--- Full install (app + resources + worker) ---');

{
  const buffer = makePBW({ uuid: TEST_UUID, hasResources: true, hasWorker: true });
  const pbw = parsePBW(buffer);
  const bridge = createMockBridge();

  await installApp(bridge, pbw);

  // Count INIT commands (one per transfer)
  const initCalls = bridge.calls.filter(c =>
    c.endpoint === Endpoint.PutBytes && c.payload[0] === PutBytesCommand.INIT
  );
  assert(initCalls.length === 3, `3 INIT calls for 3 transfers (got ${initCalls.length})`);

  // Count INSTALL commands
  const installCalls = bridge.calls.filter(c =>
    c.endpoint === Endpoint.PutBytes && c.payload[0] === PutBytesCommand.INSTALL
  );
  assert(installCalls.length === 3, `3 INSTALL calls (got ${installCalls.length})`);
}

// ================================================================
// Progress reporting
// ================================================================
console.log('\n--- Progress ---');

{
  const buffer = makePBW({ uuid: TEST_UUID, hasResources: true });
  const pbw = parsePBW(buffer);
  const bridge = createMockBridge();
  const progressCalls = [];

  await installApp(bridge, pbw, {
    onProgress: (phase, sent, total) => progressCalls.push({ phase, sent, total }),
  });

  assert(progressCalls.length > 0, 'Progress callbacks fired');
  assert(progressCalls[0].phase === 'blobdb', 'First progress is blobdb phase');

  const lastProgress = progressCalls[progressCalls.length - 1];
  assert(lastProgress.phase === 'complete', 'Last progress is complete');
  assert(lastProgress.sent === lastProgress.total, 'Final sent === total');

  // Check that total includes both binary and resources
  const expectedTotal = pbw.appBinary.length + pbw.resourcesBinary.length;
  assert(lastProgress.total === expectedTotal, `Total = ${expectedTotal} (binary + resources)`);
}

// ================================================================
// BlobDB failure
// ================================================================
console.log('\n--- BlobDB failure ---');

{
  const buffer = makePBW({ uuid: TEST_UUID });
  const pbw = parsePBW(buffer);
  const bridge = createMockBridge({ blobStatus: BlobStatus.DatabaseFull });

  let caught = null;
  try {
    await installApp(bridge, pbw);
  } catch (e) {
    caught = e;
  }

  assert(caught instanceof InstallError, 'Throws InstallError on BlobDB failure');
  assert(caught.phase === 'blobdb', 'Error phase is blobdb');
}

// ================================================================
// UUID mismatch in AppFetch
// ================================================================
console.log('\n--- UUID mismatch ---');

{
  const wrongUUID = new Uint8Array(16).fill(0xFF);
  const buffer = makePBW({ uuid: wrongUUID });
  const pbw = parsePBW(buffer);
  // Bridge will return TEST_UUID in AppFetchRequest, which doesn't match wrongUUID
  const bridge = createMockBridge();

  let caught = null;
  try {
    await installApp(bridge, pbw);
  } catch (e) {
    caught = e;
  }

  assert(caught instanceof InstallError, 'Throws InstallError on UUID mismatch');
  assert(caught.phase === 'appfetch', 'Error phase is appfetch');
}

// ================================================================
// PutBytes NACK
// ================================================================
console.log('\n--- PutBytes NACK ---');

{
  const buffer = makePBW({ uuid: TEST_UUID });
  const pbw = parsePBW(buffer);
  const bridge = createMockBridge({ nackPutBytesAt: 1 }); // NACK on first PUT

  let caught = null;
  try {
    await installApp(bridge, pbw);
  } catch (e) {
    caught = e;
  }

  assert(caught !== null, 'Throws on PutBytes NACK');
  assert(caught.message.includes('NACK'), 'Error mentions NACK');
}

// ================================================================
// Async API
// ================================================================
console.log('\n--- Async API ---');

{
  const buffer = makePBW({ uuid: TEST_UUID });
  const pbw = parsePBW(buffer);
  const bridge = createMockBridge();

  const result = installApp(bridge, pbw);
  assert(result instanceof Promise, 'Returns a Promise');
  await result;
  assert(true, 'Promise resolves on success');
}

// ================================================================
// Summary
// ================================================================
console.log(`\n=== ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
