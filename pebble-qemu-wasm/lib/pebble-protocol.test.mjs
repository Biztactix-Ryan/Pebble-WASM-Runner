/**
 * Tests for Pebble Protocol framing, AppRunState, AppFetch, BlobDB, FEED/BEEF.
 *
 * Run: node lib/pebble-protocol.test.mjs
 */

import {
  Endpoint,
  framePebblePacket,
  parsePebblePacket,
  frameFeedBeef,
  parseFeedBeef,
  AppRunStateCommand,
  buildAppRunStateStart,
  buildAppRunStateStop,
  AppFetchStatus,
  parseAppFetchRequest,
  buildAppFetchResponse,
  BlobDatabaseID,
  BlobDBCommand,
  BlobStatus,
  buildBlobDBInsert,
  parseBlobDBResponse,
  serialiseAppMetadata,
  uuidEqual,
} from './pebble-protocol.mjs';

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
// Endpoint constants
// ================================================================
console.log('\n--- Endpoint constants ---');

assert(Endpoint.AppRunState === 0x0034, 'AppRunState = 0x0034');
assert(Endpoint.AppFetch === 0x1771, 'AppFetch = 0x1771');
assert(Endpoint.PutBytes === 0xBEEF, 'PutBytes = 0xBEEF');
assert(Endpoint.BlobDB === 0xB1DB, 'BlobDB = 0xB1DB');

// ================================================================
// Pebble Protocol framing
// ================================================================
console.log('\n--- Pebble Protocol framing ---');

{
  const payload = new Uint8Array([0x01, 0x02, 0x03]);
  const frame = framePebblePacket(0xBEEF, payload);

  // length(2 BE) + endpoint(2 BE) + payload
  assert(frame.length === 7, 'Frame length = 4 + 3 = 7');
  assertBytes(frame.slice(0, 2), [0x00, 0x03], 'Length = 3 (BE)');
  assertBytes(frame.slice(2, 4), [0xBE, 0xEF], 'Endpoint = 0xBEEF (BE)');
  assertBytes(frame.slice(4), [0x01, 0x02, 0x03], 'Payload preserved');
}

// Roundtrip
{
  const payload = new Uint8Array([0xAA, 0xBB]);
  const frame = framePebblePacket(0x1771, payload);
  const parsed = parsePebblePacket(frame);
  assert(parsed.endpoint === 0x1771, 'Roundtrip endpoint matches');
  assertBytes(parsed.payload, payload, 'Roundtrip payload matches');
  assert(parsed.totalLength === frame.length, 'Roundtrip totalLength matches');
}

// Parse error: too short
{
  let threw = false;
  try { parsePebblePacket(new Uint8Array([0x00])); } catch { threw = true; }
  assert(threw, 'Throws on too-short frame');
}

// Parse error: incomplete
{
  let threw = false;
  try {
    // Header says 10 bytes of payload but only 2 present
    parsePebblePacket(new Uint8Array([0x00, 0x0A, 0xBE, 0xEF, 0x01, 0x02]));
  } catch { threw = true; }
  assert(threw, 'Throws on incomplete frame');
}

// ================================================================
// FEED/BEEF framing
// ================================================================
console.log('\n--- FEED/BEEF framing ---');

{
  const ppFrame = new Uint8Array([0x00, 0x03, 0xBE, 0xEF, 0x01, 0x02, 0x03]);
  const feedBeef = frameFeedBeef(ppFrame);

  // FEED(2) + protocol(2) + length(2) + payload(7) + BEEF(2) = 15
  assert(feedBeef.length === 15, 'FEED/BEEF frame length = 15');
  assertBytes(feedBeef.slice(0, 2), [0xFE, 0xED], 'FEED header');
  assertBytes(feedBeef.slice(2, 4), [0x00, 0x01], 'SPP protocol = 1');
  assertBytes(feedBeef.slice(4, 6), [0x00, 0x07], 'Payload length = 7');
  assertBytes(feedBeef.slice(13, 15), [0xBE, 0xEF], 'BEEF footer');
}

// Roundtrip
{
  const inner = new Uint8Array([0x11, 0x22, 0x33]);
  const frame = frameFeedBeef(inner);
  const parsed = parseFeedBeef(frame);
  assert(parsed.protocol === 1, 'Roundtrip protocol = SPP');
  assertBytes(parsed.payload, inner, 'Roundtrip payload matches');
}

// Parse error: bad header
{
  let threw = false;
  try {
    parseFeedBeef(new Uint8Array([0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0xBE, 0xEF]));
  } catch (e) { threw = e.message.includes('FEED'); }
  assert(threw, 'Throws on bad FEED header');
}

// Parse error: bad footer
{
  let threw = false;
  try {
    parseFeedBeef(new Uint8Array([0xFE, 0xED, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00]));
  } catch (e) { threw = e.message.includes('BEEF'); }
  assert(threw, 'Throws on bad BEEF footer');
}

// ================================================================
// AppRunState
// ================================================================
console.log('\n--- AppRunState ---');

{
  const uuid = new Uint8Array(16);
  for (let i = 0; i < 16; i++) uuid[i] = i + 1;

  const start = buildAppRunStateStart(uuid);
  assert(start.length === 17, 'Start message is 17 bytes');
  assert(start[0] === AppRunStateCommand.Start, 'Command = Start (0x01)');
  assertBytes(start.slice(1), uuid, 'UUID preserved in Start');

  const stop = buildAppRunStateStop(uuid);
  assert(stop[0] === AppRunStateCommand.Stop, 'Command = Stop (0x02)');
  assertBytes(stop.slice(1), uuid, 'UUID preserved in Stop');
}

// ================================================================
// AppFetch
// ================================================================
console.log('\n--- AppFetch ---');

{
  // Build a mock AppFetchRequest: command(1) + uuid(16) + app_id(4 LE)
  const uuid = new Uint8Array(16);
  for (let i = 0; i < 16; i++) uuid[i] = 0xA0 + i;

  const buf = new Uint8Array(21);
  buf[0] = 0x01; // command
  buf.set(uuid, 1);
  const view = new DataView(buf.buffer);
  view.setInt32(17, 42, true); // app_id = 42 (LE)

  const req = parseAppFetchRequest(buf);
  assert(req.command === 0x01, 'AppFetch command = 0x01');
  assertBytes(req.uuid, uuid, 'AppFetch UUID matches');
  assert(req.appId === 42, 'AppFetch appId = 42');
}

// AppFetch response
{
  const resp = buildAppFetchResponse(AppFetchStatus.Start);
  assertBytes(resp, [0x01, 0x01], 'AppFetch response Start');
}

{
  const resp = buildAppFetchResponse(AppFetchStatus.InvalidUUID);
  assertBytes(resp, [0x01, 0x03], 'AppFetch response InvalidUUID');
}

// Too short
{
  let threw = false;
  try { parseAppFetchRequest(new Uint8Array(10)); } catch { threw = true; }
  assert(threw, 'Throws on short AppFetchRequest');
}

// ================================================================
// BlobDB
// ================================================================
console.log('\n--- BlobDB ---');

{
  const key = new Uint8Array(16);
  for (let i = 0; i < 16; i++) key[i] = i;
  const value = new Uint8Array([0xAA, 0xBB, 0xCC]);

  const msg = buildBlobDBInsert(1234, BlobDatabaseID.App, key, value);

  // command(1) + token(2 LE) + db(1) + key_size(1) + key(16) + value_size(2 LE) + value(3) = 26
  assert(msg.length === 26, 'BlobDB Insert length = 26');
  assert(msg[0] === BlobDBCommand.Insert, 'Command = Insert (0x01)');

  const view = new DataView(msg.buffer, msg.byteOffset);
  assert(view.getUint16(1, true) === 1234, 'Token = 1234 (LE)');
  assert(msg[3] === BlobDatabaseID.App, 'Database = App (2)');
  assert(msg[4] === 16, 'Key size = 16');
  assertBytes(msg.slice(5, 21), key, 'Key preserved');
  assert(view.getUint16(21, true) === 3, 'Value size = 3 (LE)');
  assertBytes(msg.slice(23, 26), [0xAA, 0xBB, 0xCC], 'Value preserved');
}

// BlobDB response
{
  const data = new Uint8Array(3);
  const view = new DataView(data.buffer);
  view.setUint16(0, 1234, true); // token LE
  data[2] = BlobStatus.Success;

  const resp = parseBlobDBResponse(data);
  assert(resp.token === 1234, 'BlobDB response token = 1234');
  assert(resp.status === BlobStatus.Success, 'BlobDB response status = Success');
}

// Too short
{
  let threw = false;
  try { parseBlobDBResponse(new Uint8Array(2)); } catch { threw = true; }
  assert(threw, 'Throws on short BlobDB response');
}

// ================================================================
// AppMetadata serialisation
// ================================================================
console.log('\n--- AppMetadata ---');

{
  const uuid = new Uint8Array(16);
  for (let i = 0; i < 16; i++) uuid[i] = i + 0x10;

  const meta = serialiseAppMetadata({
    uuid,
    flags: 0x00000001,
    icon: 42,
    appVersionMajor: 1,
    appVersionMinor: 2,
    sdkVersionMajor: 5,
    sdkVersionMinor: 86,
    appName: 'TestApp',
  });

  assert(meta.length === 126, 'AppMetadata is 126 bytes');
  assertBytes(meta.slice(0, 16), uuid, 'UUID at offset 0');

  const view = new DataView(meta.buffer);
  assert(view.getUint32(16, true) === 1, 'Flags at offset 16 (LE)');
  assert(view.getUint32(20, true) === 42, 'Icon at offset 20 (LE)');
  assert(meta[24] === 1, 'appVersionMajor at offset 24');
  assert(meta[25] === 2, 'appVersionMinor at offset 25');
  assert(meta[26] === 5, 'sdkVersionMajor at offset 26');
  assert(meta[27] === 86, 'sdkVersionMinor at offset 27');
  assert(meta[28] === 0, 'app_face_bg_color = 0');
  assert(meta[29] === 0, 'app_face_template_id = 0');

  // App name at offset 30, 96 bytes
  const nameSlice = meta.slice(30, 30 + 7);
  const name = new TextDecoder().decode(nameSlice);
  assert(name === 'TestApp', 'App name at offset 30');
  assert(meta[30 + 7] === 0, 'App name null-padded');
}

// ================================================================
// UUID comparison
// ================================================================
console.log('\n--- uuidEqual ---');

{
  const a = new Uint8Array(16).fill(0xAA);
  const b = new Uint8Array(16).fill(0xAA);
  assert(uuidEqual(a, b) === true, 'Equal UUIDs match');
}

{
  const a = new Uint8Array(16).fill(0xAA);
  const b = new Uint8Array(16).fill(0xBB);
  assert(uuidEqual(a, b) === false, 'Different UUIDs do not match');
}

{
  assert(uuidEqual(new Uint8Array(15), new Uint8Array(16)) === false, 'Wrong-length UUID rejected');
}

// ================================================================
// Summary
// ================================================================
console.log(`\n=== ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
