/**
 * Tests for PutBytes message construction, CRC-32, and response parsing.
 * Reference values generated from libpebble2 Python implementation.
 *
 * Run: node lib/putbytes.test.mjs
 */

import { stm32Crc32 } from './stm32-crc32.mjs';
import {
  PUTBYTES_ENDPOINT,
  PUTBYTES_MAX_CHUNK,
  PutBytesCommand,
  PutBytesResult,
  ObjectType,
  buildPutBytesAppInit,
  buildPutBytesInit,
  buildPutBytesPut,
  buildPutBytesCommit,
  buildPutBytesAbort,
  buildPutBytesInstall,
  parsePutBytesResponse,
} from './putbytes.mjs';

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

function assertBytes(actual, expected, msg) {
  const a = Array.from(actual);
  const e = Array.from(expected);
  const match = a.length === e.length && a.every((v, i) => v === e[i]);
  if (!match) {
    console.error(`  FAIL: ${msg}`);
    console.error(`    expected: [${e.map(b => '0x' + b.toString(16).padStart(2, '0')).join(', ')}]`);
    console.error(`    actual:   [${a.map(b => '0x' + b.toString(16).padStart(2, '0')).join(', ')}]`);
    failed++;
  } else {
    console.log(`  ok: ${msg}`);
    passed++;
  }
}

// ================================================================
// STM32 CRC-32 tests
// ================================================================
console.log('\n--- STM32 CRC-32 ---');

const crcTests = [
  { input: 'ABCD', expected: 0xCF534AE1 },
  { input: 'ABC', expected: 0x6886F4D1 },
  { input: 'A', expected: 0xF743B0BB },
  { input: 'Hello, World!', expected: 0xD50A13E2 },
  { input: '\x00\x00\x00\x00', expected: 0xC704DD7B },
  { input: '\xff\xff\xff\xff', expected: 0x00000000 },
];

for (const { input, expected } of crcTests) {
  const data = new Uint8Array([...input].map(c => c.charCodeAt(0)));
  const result = stm32Crc32(data);
  assert(result === expected,
    `CRC32("${input.length <= 10 ? input : input.slice(0,10) + '...'}") = 0x${result.toString(16).toUpperCase().padStart(8, '0')} (expected 0x${expected.toString(16).toUpperCase().padStart(8, '0')})`);
}

// Test with bytes(range(256))
const range256 = new Uint8Array(256);
for (let i = 0; i < 256; i++) range256[i] = i;
const range256Crc = stm32Crc32(range256);
assert(range256Crc === 0xB7EC66F4,
  `CRC32(range(256)) = 0x${range256Crc.toString(16).toUpperCase().padStart(8, '0')} (expected 0xB7EC66F4)`);

// Two-word test
const twoWord = new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]);
const twoWordCrc = stm32Crc32(twoWord);
assert(twoWordCrc === 0xA3141BDA,
  `CRC32([01..08]) = 0x${twoWordCrc.toString(16).toUpperCase().padStart(8, '0')} (expected 0xA3141BDA)`);

// ================================================================
// Constants tests
// ================================================================
console.log('\n--- Constants ---');
assert(PUTBYTES_ENDPOINT === 0xBEEF, 'Endpoint is 0xBEEF');
assert(PUTBYTES_MAX_CHUNK === 2000, 'Max chunk is 2000');
assert(ObjectType.AppExecutable === 0x05, 'AppExecutable = 0x05');
assert(ObjectType.Worker === 0x07, 'Worker = 0x07');

// ================================================================
// buildPutBytesAppInit tests
// ================================================================
console.log('\n--- buildPutBytesAppInit ---');

{
  const msg = buildPutBytesAppInit(ObjectType.AppExecutable, 12345, 42);
  assert(msg.length === 10, 'AppInit length is 10 bytes');
  assert(msg[0] === 0x01, 'Command byte is INIT (0x01)');

  // objectSize = 12345 = 0x00003039 (big-endian)
  assertBytes(msg.slice(1, 5), [0x00, 0x00, 0x30, 0x39], 'objectSize = 12345 BE');

  // objectType = 0x05 | 0x80 = 0x85
  assert(msg[5] === 0x85, 'objectType = 0x85 (AppExecutable | bit7)');

  // appId = 42 = 0x0000002A (big-endian)
  assertBytes(msg.slice(6, 10), [0x00, 0x00, 0x00, 0x2A], 'appId = 42 BE');
}

// ================================================================
// buildPutBytesInit (legacy) tests
// ================================================================
console.log('\n--- buildPutBytesInit (legacy) ---');

{
  const msg = buildPutBytesInit(ObjectType.AppExecutable, 5000, 3, 'test');
  assert(msg[0] === 0x01, 'Command byte is INIT (0x01)');

  // objectSize = 5000 = 0x00001388 (big-endian)
  assertBytes(msg.slice(1, 5), [0x00, 0x00, 0x13, 0x88], 'objectSize = 5000 BE');

  assert(msg[5] === 0x05, 'objectType = 0x05 (no bit7)');
  assert(msg[6] === 0x03, 'bank = 3');

  // filename "test" + null
  assertBytes(msg.slice(7, 12), [0x74, 0x65, 0x73, 0x74, 0x00], 'filename = "test\\0"');
}

// ================================================================
// buildPutBytesPut tests
// ================================================================
console.log('\n--- buildPutBytesPut ---');

{
  const chunk = new Uint8Array([0xDE, 0xAD, 0xBE, 0xEF]);
  const msg = buildPutBytesPut(0x12345678, chunk);
  assert(msg.length === 9 + 4, 'PUT length is 13 bytes');
  assert(msg[0] === 0x02, 'Command byte is PUT (0x02)');

  // cookie = 0x12345678 (big-endian)
  assertBytes(msg.slice(1, 5), [0x12, 0x34, 0x56, 0x78], 'cookie BE');

  // payloadSize = 4 (big-endian)
  assertBytes(msg.slice(5, 9), [0x00, 0x00, 0x00, 0x04], 'payloadSize = 4 BE');

  // payload
  assertBytes(msg.slice(9), [0xDE, 0xAD, 0xBE, 0xEF], 'payload matches');
}

// Empty chunk
{
  const msg = buildPutBytesPut(1, new Uint8Array(0));
  assert(msg.length === 9, 'PUT with empty chunk is 9 bytes');
  assertBytes(msg.slice(5, 9), [0x00, 0x00, 0x00, 0x00], 'payloadSize = 0');
}

// Max chunk size
{
  const bigChunk = new Uint8Array(PUTBYTES_MAX_CHUNK);
  const msg = buildPutBytesPut(1, bigChunk);
  assert(msg.length === 9 + 2000, 'PUT with max chunk is 2009 bytes');
  assertBytes(msg.slice(5, 9), [0x00, 0x00, 0x07, 0xD0], 'payloadSize = 2000 BE');
}

// ================================================================
// buildPutBytesCommit tests
// ================================================================
console.log('\n--- buildPutBytesCommit ---');

{
  const msg = buildPutBytesCommit(0xAABBCCDD, 0x11223344);
  assert(msg.length === 9, 'COMMIT length is 9 bytes');
  assert(msg[0] === 0x03, 'Command byte is COMMIT (0x03)');
  assertBytes(msg.slice(1, 5), [0xAA, 0xBB, 0xCC, 0xDD], 'cookie BE');
  assertBytes(msg.slice(5, 9), [0x11, 0x22, 0x33, 0x44], 'objectCrc BE');
}

// ================================================================
// buildPutBytesAbort tests
// ================================================================
console.log('\n--- buildPutBytesAbort ---');

{
  const msg = buildPutBytesAbort(0xDEADBEEF);
  assert(msg.length === 5, 'ABORT length is 5 bytes');
  assert(msg[0] === 0x04, 'Command byte is ABORT (0x04)');
  assertBytes(msg.slice(1, 5), [0xDE, 0xAD, 0xBE, 0xEF], 'cookie BE');
}

// ================================================================
// buildPutBytesInstall tests
// ================================================================
console.log('\n--- buildPutBytesInstall ---');

{
  const msg = buildPutBytesInstall(0xCAFEBABE);
  assert(msg.length === 5, 'INSTALL length is 5 bytes');
  assert(msg[0] === 0x05, 'Command byte is INSTALL (0x05)');
  assertBytes(msg.slice(1, 5), [0xCA, 0xFE, 0xBA, 0xBE], 'cookie BE');
}

// ================================================================
// parsePutBytesResponse tests
// ================================================================
console.log('\n--- parsePutBytesResponse ---');

{
  // ACK with cookie
  const ackData = new Uint8Array([0x01, 0x00, 0x00, 0x00, 0x2A]);
  const ack = parsePutBytesResponse(ackData);
  assert(ack.result === PutBytesResult.ACK, 'ACK result = 0x01');
  assert(ack.cookie === 42, 'ACK cookie = 42');
}

{
  // NACK with cookie
  const nackData = new Uint8Array([0x02, 0xDE, 0xAD, 0xBE, 0xEF]);
  const nack = parsePutBytesResponse(nackData);
  assert(nack.result === PutBytesResult.NACK, 'NACK result = 0x02');
  assert(nack.cookie === 0xDEADBEEF, 'NACK cookie = 0xDEADBEEF');
}

{
  // Too short
  let threw = false;
  try {
    parsePutBytesResponse(new Uint8Array([0x01, 0x02]));
  } catch (e) {
    threw = true;
  }
  assert(threw, 'Throws on short response');
}

// ================================================================
// Summary
// ================================================================
console.log(`\n=== ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
