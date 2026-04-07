/**
 * PBW file loader — reads a .pbw file via the browser File API
 * and validates it as a ZIP archive.
 *
 * A PBW is a ZIP file containing manifest.json, app binary, resources, etc.
 * ZIP files start with the local file header signature: PK\x03\x04 (0x504B0304).
 */

const ZIP_MAGIC = 0x04034B50;

/**
 * Read a File object as an ArrayBuffer.
 * Uses file.arrayBuffer() (modern API, works in browsers and Node.js 20+).
 * @param {File|Blob} file - File from an <input type="file"> element
 * @returns {Promise<ArrayBuffer>}
 */
function readFileAsArrayBuffer(file) {
  return file.arrayBuffer();
}

/**
 * Validate that a buffer starts with the ZIP magic bytes.
 * @param {ArrayBuffer} buffer
 * @returns {boolean}
 */
function isZipFile(buffer) {
  if (buffer.byteLength < 4) return false;
  const view = new DataView(buffer);
  return view.getUint32(0, true) === ZIP_MAGIC; // little-endian
}

/**
 * Load and validate a PBW file from a browser File object.
 *
 * @param {File} file - File from <input type="file">
 * @returns {Promise<{ buffer: ArrayBuffer, name: string, size: number }>}
 * @throws {Error} If file is null, empty, too small, or not a valid ZIP
 */
export async function loadPbwFile(file) {
  if (!file) {
    throw new Error('No file provided');
  }

  if (file.size === 0) {
    throw new Error('File is empty');
  }

  const buffer = await readFileAsArrayBuffer(file);

  if (!isZipFile(buffer)) {
    throw new Error('Not a valid PBW file (missing ZIP header)');
  }

  return {
    buffer,
    name: file.name,
    size: file.size,
  };
}

// Export for testing
export { isZipFile, readFileAsArrayBuffer };
