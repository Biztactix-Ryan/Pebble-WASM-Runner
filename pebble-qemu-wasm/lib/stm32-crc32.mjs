/**
 * STM32 CRC-32 implementation.
 *
 * This is NOT standard CRC-32. The STM32 hardware CRC unit uses:
 * - Polynomial: 0x04C11DB7
 * - Initial value: 0xFFFFFFFF
 * - No input/output reflection (MSB-first)
 * - Processes data in 4-byte words (read as little-endian uint32)
 *
 * Ported from libpebble2/util/stm32_crc.py
 */

const CRC_POLY = 0x04C11DB7;

/**
 * Process a single 32-bit word into the CRC.
 * @param {number} word - 32-bit unsigned integer
 * @param {number} crc - Current CRC value
 * @returns {number} Updated CRC value
 */
function processWord(word, crc) {
  crc = (crc ^ word) >>> 0;
  for (let i = 0; i < 32; i++) {
    if (crc & 0x80000000) {
      crc = ((crc << 1) ^ CRC_POLY) >>> 0;
    } else {
      crc = (crc << 1) >>> 0;
    }
  }
  return crc >>> 0;
}

/**
 * Compute STM32 CRC-32 over a byte buffer.
 * @param {Uint8Array} data - Input data
 * @returns {number} CRC-32 value (unsigned 32-bit)
 */
export function stm32Crc32(data) {
  let crc = 0xFFFFFFFF;
  const wordCount = Math.ceil(data.length / 4);

  for (let i = 0; i < wordCount; i++) {
    const offset = i * 4;
    const remaining = data.length - offset;

    let word;
    if (remaining >= 4) {
      // Full word: read as little-endian uint32
      // (matches Python: array.array('I', data[i*4:(i+1)*4])[0] on LE)
      word = data[offset] | (data[offset + 1] << 8) |
             (data[offset + 2] << 16) | (data[offset + 3] << 24);
    } else {
      // Partial word: pad with leading zeros, reverse, read as LE uint32.
      // Python: d_array = [0x00...] + bytes; d_array.reverse(); array('I')[0]
      // Net effect for e.g. [A, B, C]: pad → [0, A, B, C] → reverse → [C, B, A, 0]
      // → LE read → 0x00_A_B_C
      const padded = new Uint8Array(4); // zeros
      for (let j = 0; j < remaining; j++) {
        padded[j] = data[offset + j];
      }
      // Replicate: insert leading zeros then reverse then LE read
      const withLeadingZeros = new Uint8Array(4);
      const padCount = 4 - remaining;
      for (let j = 0; j < padCount; j++) {
        withLeadingZeros[j] = 0;
      }
      for (let j = 0; j < remaining; j++) {
        withLeadingZeros[padCount + j] = data[offset + j];
      }
      // Reverse
      withLeadingZeros.reverse();
      // Read as LE uint32
      word = withLeadingZeros[0] | (withLeadingZeros[1] << 8) |
             (withLeadingZeros[2] << 16) | (withLeadingZeros[3] << 24);
    }

    word = word >>> 0;
    crc = processWord(word, crc);
  }

  return crc >>> 0;
}
