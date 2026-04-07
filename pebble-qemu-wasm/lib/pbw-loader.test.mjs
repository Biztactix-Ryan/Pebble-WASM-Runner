/**
 * Tests for PBW loader — uses Node.js Blob/File polyfill (available in Node 20+).
 *
 * Run: node lib/pbw-loader.test.mjs
 */

import { isZipFile, loadPbwFile } from './pbw-loader.mjs';

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

// Helper: create a File-like object from bytes (Node.js 20+ has File in global)
function makeFile(bytes, name = 'test.pbw') {
  const buffer = new Uint8Array(bytes);
  return new File([buffer], name, { type: 'application/octet-stream' });
}

// Valid ZIP header: PK\x03\x04 followed by some data
const VALID_ZIP_BYTES = [0x50, 0x4B, 0x03, 0x04, 0x00, 0x00, 0x00, 0x00];
// Not a ZIP
const NOT_ZIP_BYTES = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05];
// Too short
const SHORT_BYTES = [0x50, 0x4B];

// ================================================================
// isZipFile tests
// ================================================================
console.log('\n--- isZipFile ---');

{
  const buf = new Uint8Array(VALID_ZIP_BYTES).buffer;
  assert(isZipFile(buf) === true, 'Valid ZIP header detected');
}

{
  const buf = new Uint8Array(NOT_ZIP_BYTES).buffer;
  assert(isZipFile(buf) === false, 'Non-ZIP rejected');
}

{
  const buf = new Uint8Array(SHORT_BYTES).buffer;
  assert(isZipFile(buf) === false, 'Too-short buffer rejected');
}

{
  const buf = new ArrayBuffer(0);
  assert(isZipFile(buf) === false, 'Empty buffer rejected');
}

// ================================================================
// loadPbwFile tests
// ================================================================
console.log('\n--- loadPbwFile ---');

// Valid PBW file
{
  const file = makeFile(VALID_ZIP_BYTES, 'myapp.pbw');
  const result = await loadPbwFile(file);
  assert(result.buffer instanceof ArrayBuffer, 'Returns ArrayBuffer');
  assert(result.buffer.byteLength === 8, 'Buffer has correct size');
  assert(result.name === 'myapp.pbw', 'Name preserved');
  assert(result.size === 8, 'Size preserved');
}

// No file provided
{
  let threw = false;
  try { await loadPbwFile(null); } catch (e) { threw = e.message.includes('No file'); }
  assert(threw, 'Throws on null file');
}

// Empty file
{
  const file = makeFile([], 'empty.pbw');
  let threw = false;
  try { await loadPbwFile(file); } catch (e) { threw = e.message.includes('empty'); }
  assert(threw, 'Throws on empty file');
}

// Not a ZIP
{
  const file = makeFile(NOT_ZIP_BYTES, 'notzip.pbw');
  let threw = false;
  try { await loadPbwFile(file); } catch (e) { threw = e.message.includes('ZIP'); }
  assert(threw, 'Throws on non-ZIP file');
}

// Too short for ZIP magic
{
  const file = makeFile(SHORT_BYTES, 'short.pbw');
  let threw = false;
  try { await loadPbwFile(file); } catch (e) { threw = e.message.includes('ZIP'); }
  assert(threw, 'Throws on too-short file');
}

// ================================================================
// Summary
// ================================================================
console.log(`\n=== ${passed} passed, ${failed} failed ===`);
process.exit(failed > 0 ? 1 : 0);
