/**
 * Tests for PutBytes chunked transfer engine.
 * Uses a mock bridge to verify the full INIT → PUT → COMMIT → INSTALL flow.
 *
 * Run: node lib/putbytes-transfer.test.mjs
 */

import {
  PUTBYTES_ENDPOINT,
  PutBytesCommand,
  PutBytesResult,
  ObjectType,
  stm32Crc32,
} from './putbytes.mjs';
import { putBytesTransfer, PutBytesError } from './putbytes-transfer.mjs';

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
 * Create a mock bridge that records calls and returns configurable responses.
 * @param {Object} [options]
 * @param {number} [options.cookie=42] - Cookie to return in ACK responses
 * @param {Map<number, number>} [options.nackOn] - Map of call index → NACK result
 * @param {Set<number>} [options.timeoutOn] - Set of call indices that should timeout
 */
function createMockBridge({ cookie = 42, nackOn = new Map(), timeoutOn = new Set() } = {}) {
  const calls = [];
  let callIndex = 0;

  return {
    calls,
    async sendAndReceive(endpoint, payload, timeout) {
      const idx = callIndex++;
      const command = payload[0];
      calls.push({ endpoint, payload: new Uint8Array(payload), command, timeout });

      if (timeoutOn.has(idx)) {
        throw new Error('Timeout waiting for response');
      }

      // Build response: result(1) + cookie(4 BE)
      const resp = new Uint8Array(5);
      const view = new DataView(resp.buffer);
      const result = nackOn.has(idx) ? nackOn.get(idx) : PutBytesResult.ACK;
      view.setUint8(0, result);
      view.setUint32(1, cookie, false);
      return resp;
    },
  };
}

// ================================================================
// Chunking logic tests
// ================================================================
console.log('\n--- Chunking ---');

{
  // 5000 bytes with default 2000-byte chunks → 3 chunks (2000+2000+1000)
  const bridge = createMockBridge();
  const data = new Uint8Array(5000);
  for (let i = 0; i < data.length; i++) data[i] = i & 0xFF;

  await putBytesTransfer(bridge, {
    objectType: ObjectType.AppExecutable,
    data,
    appId: 7,
  });

  // Expected calls: INIT + 3 PUTs + COMMIT + INSTALL = 6
  assert(bridge.calls.length === 6, `6 calls total (got ${bridge.calls.length})`);
  assert(bridge.calls[0].command === PutBytesCommand.INIT, 'Call 0 is INIT');
  assert(bridge.calls[1].command === PutBytesCommand.PUT, 'Call 1 is PUT');
  assert(bridge.calls[2].command === PutBytesCommand.PUT, 'Call 2 is PUT');
  assert(bridge.calls[3].command === PutBytesCommand.PUT, 'Call 3 is PUT');
  assert(bridge.calls[4].command === PutBytesCommand.COMMIT, 'Call 4 is COMMIT');
  assert(bridge.calls[5].command === PutBytesCommand.INSTALL, 'Call 5 is INSTALL');

  // Verify endpoints
  assert(bridge.calls.every(c => c.endpoint === PUTBYTES_ENDPOINT), 'All calls use PUTBYTES_ENDPOINT');
}

// Custom chunk size
{
  const bridge = createMockBridge();
  const data = new Uint8Array(100);

  await putBytesTransfer(bridge, {
    objectType: ObjectType.AppResource,
    data,
    appId: 1,
    chunkSize: 30,
  });

  // 100 / 30 = 4 chunks (30+30+30+10)
  // INIT + 4 PUTs + COMMIT + INSTALL = 7
  assert(bridge.calls.length === 7, `7 calls with chunkSize=30 (got ${bridge.calls.length})`);
}

// Exact chunk boundary (no remainder)
{
  const bridge = createMockBridge();
  const data = new Uint8Array(4000);

  await putBytesTransfer(bridge, {
    objectType: ObjectType.AppExecutable,
    data,
    appId: 1,
  });

  // 4000 / 2000 = exactly 2 chunks
  assert(bridge.calls.length === 5, `5 calls for exact 2-chunk transfer (got ${bridge.calls.length})`);
}

// ================================================================
// Full transfer sequence with mock bridge
// ================================================================
console.log('\n--- Full transfer ---');

{
  const bridge = createMockBridge({ cookie: 0xDEAD });
  const data = new Uint8Array([0x01, 0x02, 0x03, 0x04]);

  await putBytesTransfer(bridge, {
    objectType: ObjectType.AppExecutable,
    data,
    appId: 99,
  });

  // INIT + 1 PUT + COMMIT + INSTALL = 4
  assert(bridge.calls.length === 4, '4 calls for small transfer');

  // Verify INIT payload: cmd(1) + objectSize(4 BE) + type(1) + appId(4 BE) = 10 bytes
  const initPayload = bridge.calls[0].payload;
  assert(initPayload.length === 10, 'INIT payload is 10 bytes');
  assert(initPayload[5] === (ObjectType.AppExecutable | 0x80), 'INIT has correct object type with bit 7');

  // Verify PUT payload includes the data
  const putPayload = bridge.calls[1].payload;
  assert(putPayload[putPayload.length - 4] === 0x01, 'PUT payload contains data byte 0');
  assert(putPayload[putPayload.length - 1] === 0x04, 'PUT payload contains data byte 3');

  // Verify COMMIT includes CRC
  const commitPayload = bridge.calls[2].payload;
  const expectedCrc = stm32Crc32(data);
  const commitView = new DataView(commitPayload.buffer, commitPayload.byteOffset);
  const commitCrc = commitView.getUint32(5, false);
  assert(commitCrc === expectedCrc, `COMMIT CRC matches (0x${commitCrc.toString(16)} === 0x${expectedCrc.toString(16)})`);
}

// Legacy path (bank-based)
{
  const bridge = createMockBridge();
  const data = new Uint8Array(10);

  await putBytesTransfer(bridge, {
    objectType: ObjectType.AppExecutable,
    data,
    bank: 3,
    filename: 'test',
  });

  const initPayload = bridge.calls[0].payload;
  assert(initPayload[5] === ObjectType.AppExecutable, 'Legacy INIT has object type without bit 7');
  assert(initPayload[6] === 3, 'Legacy INIT has bank=3');
}

// ================================================================
// Error ACK triggers abort
// ================================================================
console.log('\n--- Error handling ---');

{
  // NACK on second PUT
  const bridge = createMockBridge({
    nackOn: new Map([[2, PutBytesResult.NACK]]),  // call index 2 = second PUT
  });
  const data = new Uint8Array(5000);

  let caught = null;
  try {
    await putBytesTransfer(bridge, { objectType: ObjectType.AppExecutable, data, appId: 1 });
  } catch (e) {
    caught = e;
  }

  assert(caught instanceof PutBytesError, 'Throws PutBytesError on NACK');
  assert(caught.phase === 'PUT', 'Error phase is PUT');

  // Should have attempted ABORT after the NACK
  const lastCall = bridge.calls[bridge.calls.length - 1];
  assert(lastCall.command === PutBytesCommand.ABORT, 'Abort sent after NACK');
}

{
  // NACK on INIT
  const bridge = createMockBridge({
    nackOn: new Map([[0, PutBytesResult.NACK]]),
  });

  let caught = null;
  try {
    await putBytesTransfer(bridge, {
      objectType: ObjectType.AppExecutable,
      data: new Uint8Array(10),
      appId: 1,
    });
  } catch (e) {
    caught = e;
  }

  assert(caught instanceof PutBytesError, 'Throws on INIT NACK');
  assert(caught.phase === 'INIT', 'Error phase is INIT');
}

{
  // NACK on COMMIT
  const bridge = createMockBridge({
    nackOn: new Map([[2, PutBytesResult.NACK]]),  // INIT=0, PUT=1, COMMIT=2
  });

  let caught = null;
  try {
    await putBytesTransfer(bridge, {
      objectType: ObjectType.AppExecutable,
      data: new Uint8Array(100),
      appId: 1,
    });
  } catch (e) {
    caught = e;
  }

  assert(caught instanceof PutBytesError, 'Throws on COMMIT NACK');
  assert(caught.phase === 'COMMIT', 'Error phase is COMMIT');
}

// ================================================================
// Timeout triggers abort
// ================================================================
console.log('\n--- Timeout ---');

{
  const bridge = createMockBridge({
    timeoutOn: new Set([1]),  // Timeout on first PUT
  });

  let caught = null;
  try {
    await putBytesTransfer(bridge, {
      objectType: ObjectType.AppExecutable,
      data: new Uint8Array(100),
      appId: 1,
      timeout: 100,
    });
  } catch (e) {
    caught = e;
  }

  assert(caught !== null, 'Throws on timeout');
  assert(caught.message.includes('Timeout'), 'Error message mentions timeout');

  // Should attempt abort
  const lastCall = bridge.calls[bridge.calls.length - 1];
  assert(lastCall.command === PutBytesCommand.ABORT, 'Abort sent after timeout');
}

// ================================================================
// Progress callback
// ================================================================
console.log('\n--- Progress ---');

{
  const bridge = createMockBridge();
  const data = new Uint8Array(5000);
  const progressCalls = [];

  await putBytesTransfer(bridge, {
    objectType: ObjectType.AppExecutable,
    data,
    appId: 1,
    onProgress: (sent, total) => progressCalls.push({ sent, total }),
  });

  assert(progressCalls.length === 3, `3 progress calls for 3 chunks (got ${progressCalls.length})`);
  assert(progressCalls[0].sent === 2000, 'Progress 1: 2000 bytes');
  assert(progressCalls[0].total === 5000, 'Progress 1: total 5000');
  assert(progressCalls[1].sent === 4000, 'Progress 2: 4000 bytes');
  assert(progressCalls[2].sent === 5000, 'Progress 3: 5000 bytes (complete)');
}

// ================================================================
// Summary
// ================================================================
console.log(`\n=== ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
