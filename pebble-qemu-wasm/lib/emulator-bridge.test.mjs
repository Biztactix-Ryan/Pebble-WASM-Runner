/**
 * Tests for EmulatorBridge using a mock WASM Module.
 *
 * Run: node lib/emulator-bridge.test.mjs
 */

import { EmulatorBridge } from './emulator-bridge.mjs';
import {
  Endpoint,
  framePebblePacket,
  frameFeedBeef,
} from './pebble-protocol.mjs';
import { PutBytesResult } from './putbytes.mjs';

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
 * Create a mock Emscripten Module that simulates the WASM serial bridge exports.
 *
 * The mock has an internal buffer simulating the WASM outbox. When inject is called,
 * it can optionally queue a response (for testing request/response flows).
 */
function createMockModule(opts = {}) {
  const heap = new Uint8Array(65536);
  let heapOffset = 1024; // start allocations at offset 1024

  // Simulated outbox
  let outbox = new Uint8Array(0);

  const mod = {
    HEAPU8: heap,
    _injectedData: [],  // track injections for assertions

    stackSave() { return heapOffset; },
    stackRestore(sp) { heapOffset = sp; },
    stackAlloc(size) {
      const ptr = heapOffset;
      heapOffset += size;
      return ptr;
    },

    _pebble_control_inject_wasm(ptr, len) {
      // Copy injected data for assertion
      const data = new Uint8Array(heap.buffer, ptr, len).slice();
      mod._injectedData.push(data);

      // If a response generator is configured, queue a response
      if (mod._responseGenerator) {
        const response = mod._responseGenerator(data);
        if (response) {
          const combined = new Uint8Array(outbox.length + response.length);
          combined.set(outbox);
          combined.set(response, outbox.length);
          outbox = combined;
        }
      }
    },

    _pebble_control_readable_wasm() {
      return outbox.length;
    },

    _pebble_control_read_wasm(ptr, maxLen) {
      const toRead = Math.min(maxLen, outbox.length);
      heap.set(outbox.subarray(0, toRead), ptr);
      outbox = outbox.subarray(toRead);
      return toRead;
    },

    // Test helper: queue a raw response in the outbox
    _queueResponse(feedBeefBytes) {
      const combined = new Uint8Array(outbox.length + feedBeefBytes.length);
      combined.set(outbox);
      combined.set(feedBeefBytes, outbox.length);
      outbox = combined;
    },

    // Test helper: set a response generator
    _responseGenerator: null,
  };

  return mod;
}

/**
 * Build a FEED/BEEF wrapped Pebble Protocol response.
 */
function buildResponse(endpoint, payload) {
  const ppFrame = framePebblePacket(endpoint, payload);
  return frameFeedBeef(ppFrame);
}

// ================================================================
// Constructor / destroy
// ================================================================
console.log('\n--- Constructor / destroy ---');

{
  const mod = createMockModule();
  const bridge = new EmulatorBridge(mod);
  assert(bridge._pollTimer !== null, 'Polling started on construction');
  bridge.destroy();
  assert(bridge._pollTimer === null, 'Polling stopped on destroy');
}

// ================================================================
// sendAndReceive — basic flow
// ================================================================
console.log('\n--- sendAndReceive ---');

{
  const mod = createMockModule();
  // When inject is called, queue an ACK response on PutBytes endpoint
  mod._responseGenerator = function(injectedData) {
    // Build a PutBytes ACK response
    const ackPayload = new Uint8Array(5);
    const view = new DataView(ackPayload.buffer);
    view.setUint8(0, PutBytesResult.ACK);
    view.setUint32(1, 42, false); // cookie
    return buildResponse(Endpoint.PutBytes, ackPayload);
  };

  const bridge = new EmulatorBridge(mod);

  const testPayload = new Uint8Array([0x01, 0x00, 0x00, 0x00, 0x2A]);
  const response = await bridge.sendAndReceive(Endpoint.PutBytes, testPayload, 2000);

  assert(response.length === 5, 'Response is 5 bytes');
  assert(response[0] === PutBytesResult.ACK, 'Response is ACK');
  assert(mod._injectedData.length === 1, 'One injection made');

  bridge.destroy();
}

// ================================================================
// waitForMessage — unsolicited message
// ================================================================
console.log('\n--- waitForMessage ---');

{
  const mod = createMockModule();
  const bridge = new EmulatorBridge(mod);

  // Set up a promise to wait for AppFetch
  const waitPromise = bridge.waitForMessage(Endpoint.AppFetch, 2000);

  // Queue an AppFetch request after a small delay
  setTimeout(() => {
    const fetchPayload = new Uint8Array(21);
    fetchPayload[0] = 0x01; // command
    // uuid + app_id filled with zeros (for testing)
    mod._queueResponse(buildResponse(Endpoint.AppFetch, fetchPayload));
  }, 50);

  const msg = await waitPromise;
  assert(msg.length === 21, 'Received 21-byte AppFetch message');
  assert(msg[0] === 0x01, 'AppFetch command = 0x01');

  bridge.destroy();
}

// ================================================================
// Timeout
// ================================================================
console.log('\n--- Timeout ---');

{
  const mod = createMockModule();
  const bridge = new EmulatorBridge(mod);

  let caught = null;
  try {
    await bridge.sendAndReceive(Endpoint.PutBytes, new Uint8Array([0x01]), 100);
  } catch (e) {
    caught = e;
  }

  assert(caught !== null, 'Throws on timeout');
  assert(caught.message.includes('Timeout'), 'Error mentions timeout');

  bridge.destroy();
}

// ================================================================
// Injection framing
// ================================================================
console.log('\n--- Injection framing ---');

{
  const mod = createMockModule();
  // Don't auto-respond — just check what gets injected
  const bridge = new EmulatorBridge(mod);

  // Fire and forget (will timeout, but we just want to check injection)
  bridge.sendAndReceive(Endpoint.PutBytes, new Uint8Array([0x42]), 100).catch(() => {});

  // Give it a tick
  await new Promise(r => setTimeout(r, 10));

  assert(mod._injectedData.length === 1, 'Injection occurred');

  const injected = mod._injectedData[0];
  // Should be FEED/BEEF wrapped: FEED(2) + proto(2) + len(2) + PP_frame + BEEF(2)
  assert(injected[0] === 0xFE && injected[1] === 0xED, 'Starts with FEED');
  assert(injected[injected.length - 2] === 0xBE && injected[injected.length - 1] === 0xEF,
    'Ends with BEEF');

  // Inner PP frame: len(2 BE) + endpoint(2 BE) + payload
  // PP payload is 1 byte (0x42), so PP len = 1
  // FEED/BEEF protocol = 0x0001 (SPP)
  assert(injected[2] === 0x00 && injected[3] === 0x01, 'SPP protocol');

  bridge.destroy();
}

// ================================================================
// Multiple responses / routing
// ================================================================
console.log('\n--- Endpoint routing ---');

{
  const mod = createMockModule();
  const bridge = new EmulatorBridge(mod);

  // Queue a BlobDB response
  const blobResp = new Uint8Array(3);
  const blobView = new DataView(blobResp.buffer);
  blobView.setUint16(0, 1234, true); // token LE
  blobResp[2] = 0x01; // Success

  // Wait for both BlobDB and PutBytes
  const blobPromise = bridge.waitForMessage(Endpoint.BlobDB, 2000);
  const pbPromise = bridge.waitForMessage(Endpoint.PutBytes, 2000);

  // Queue BlobDB response first, then PutBytes
  setTimeout(() => {
    mod._queueResponse(buildResponse(Endpoint.BlobDB, blobResp));
  }, 30);

  setTimeout(() => {
    const ack = new Uint8Array(5);
    new DataView(ack.buffer).setUint8(0, PutBytesResult.ACK);
    new DataView(ack.buffer).setUint32(1, 99, false);
    mod._queueResponse(buildResponse(Endpoint.PutBytes, ack));
  }, 60);

  const blob = await blobPromise;
  assert(blob.length === 3, 'BlobDB response is 3 bytes');
  assert(blob[2] === 0x01, 'BlobDB status = Success');

  const pb = await pbPromise;
  assert(pb.length === 5, 'PutBytes response is 5 bytes');
  assert(pb[0] === PutBytesResult.ACK, 'PutBytes ACK');

  bridge.destroy();
}

// ================================================================
// Destroy rejects pending
// ================================================================
console.log('\n--- Destroy rejects pending ---');

{
  const mod = createMockModule();
  const bridge = new EmulatorBridge(mod);

  let caught = null;
  const promise = bridge.waitForMessage(Endpoint.AppFetch, 5000);
  bridge.destroy();

  try {
    await promise;
  } catch (e) {
    caught = e;
  }

  assert(caught !== null, 'Pending promise rejected on destroy');
  assert(caught.message.includes('destroyed'), 'Error mentions destroyed');
}

// ================================================================
// Summary
// ================================================================
console.log(`\n=== ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
