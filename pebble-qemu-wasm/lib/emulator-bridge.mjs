/**
 * Emulator bridge — connects JavaScript to the QEMU WASM emulator's serial port.
 *
 * Implements the InstallBridge interface used by app-installer.mjs:
 *   - sendAndReceive(endpoint, payload, timeout) → Promise<Uint8Array>
 *   - waitForMessage(endpoint, timeout) → Promise<Uint8Array>
 *
 * Injection path (JS → firmware):
 *   Pebble Protocol payload → framePebblePacket → frameFeedBeef → WASM heap → _pebble_control_inject_wasm
 *
 * Reception path (firmware → JS):
 *   Poll _pebble_control_readable_wasm/_read_wasm → parse FEED/BEEF → parse Pebble Protocol → route by endpoint
 */

import {
  Endpoint,
  framePebblePacket,
  frameFeedBeef,
  parseFeedBeef,
  parsePebblePacket,
} from './pebble-protocol.mjs';

const POLL_INTERVAL_MS = 16;
const READ_BUF_SIZE = 4096;

export class EmulatorBridge {
  /**
   * @param {Object} Module - Emscripten Module object with WASM exports
   */
  constructor(Module, { debug = false } = {}) {
    this._Module = Module;
    this._pendingResolvers = new Map(); // endpoint → { resolve, reject, timer }
    this._incomingBuffer = new Uint8Array(0);
    this._pollTimer = null;
    this._debug = debug;
    this._startPolling();
  }

  /**
   * Send a Pebble Protocol message and wait for a response on the same endpoint.
   * @param {number} endpoint - Pebble Protocol endpoint ID
   * @param {Uint8Array} payload - Message payload
   * @param {number} [timeout=15000] - Timeout in ms
   * @returns {Promise<Uint8Array>} Response payload
   */
  sendAndReceive(endpoint, payload, timeout = 15000) {
    return new Promise((resolve, reject) => {
      // Register resolver for this endpoint
      const timer = setTimeout(() => {
        this._pendingResolvers.delete(endpoint);
        reject(new Error(`Timeout waiting for response on endpoint 0x${endpoint.toString(16)}`));
      }, timeout);

      this._pendingResolvers.set(endpoint, { resolve, reject, timer });

      // Frame and inject the packet
      try {
        this._inject(endpoint, payload);
      } catch (e) {
        clearTimeout(timer);
        this._pendingResolvers.delete(endpoint);
        reject(e);
      }
    });
  }

  /**
   * Wait for an unsolicited message on a specific endpoint.
   * @param {number} endpoint - Pebble Protocol endpoint ID
   * @param {number} [timeout=15000] - Timeout in ms
   * @returns {Promise<Uint8Array>} Message payload
   */
  waitForMessage(endpoint, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this._pendingResolvers.delete(endpoint);
        reject(new Error(`Timeout waiting for message on endpoint 0x${endpoint.toString(16)}`));
      }, timeout);

      this._pendingResolvers.set(endpoint, { resolve, reject, timer });
    });
  }

  /**
   * Send a message without waiting for a response (fire-and-forget).
   * @param {number} endpoint
   * @param {Uint8Array} payload
   */
  send(endpoint, payload) {
    this._inject(endpoint, payload);
  }

  /**
   * Frame a Pebble Protocol message in FEED/BEEF and inject into the emulator.
   */
  _inject(endpoint, payload) {
    const ppFrame = framePebblePacket(endpoint, payload);
    const feedBeefFrame = frameFeedBeef(ppFrame);

    const M = this._Module;

    if (this._debug) {
      const hex = Array.from(feedBeefFrame.slice(0, 20)).map(b => b.toString(16).padStart(2, '0')).join(' ');
      console.log(`[bridge] inject ${feedBeefFrame.length} bytes to endpoint 0x${endpoint.toString(16)}: ${hex}...`);
    }

    // Use stack allocation (no _malloc/_free needed)
    const sp = M.stackSave();
    try {
      const ptr = M.stackAlloc(feedBeefFrame.length);
      M.HEAPU8.set(feedBeefFrame, ptr);
      M._pebble_control_inject_wasm(ptr, feedBeefFrame.length);
    } finally {
      M.stackRestore(sp);
    }
  }

  /**
   * Start polling the WASM outbox for incoming data.
   */
  _startPolling() {
    this._pollTimer = setInterval(() => this._poll(), POLL_INTERVAL_MS);
  }

  /**
   * Stop polling.
   */
  _stopPolling() {
    if (this._pollTimer !== null) {
      clearInterval(this._pollTimer);
      this._pollTimer = null;
    }
  }

  /**
   * Poll the WASM outbox for available data.
   */
  _poll() {
    const M = this._Module;
    if (!M._pebble_control_readable_wasm) return;

    const avail = M._pebble_control_readable_wasm();
    if (avail <= 0) return;

    if (this._debug) {
      console.log(`[bridge] outbox has ${avail} bytes`);
    }

    // Use stack allocation for read buffer
    const readLen = Math.min(avail, READ_BUF_SIZE);
    const sp = M.stackSave();
    const ptr = M.stackAlloc(readLen);

    const bytesRead = M._pebble_control_read_wasm(ptr, readLen);
    if (bytesRead <= 0) {
      M.stackRestore(sp);
      return;
    }

    // Copy from WASM heap to JS before restoring stack
    const chunk = new Uint8Array(M.HEAPU8.buffer, ptr, bytesRead).slice();
    M.stackRestore(sp);

    // Append to incoming buffer
    const combined = new Uint8Array(this._incomingBuffer.length + chunk.length);
    combined.set(this._incomingBuffer);
    combined.set(chunk, this._incomingBuffer.length);
    this._incomingBuffer = combined;

    // Try to parse complete FEED/BEEF frames
    this._processIncoming();
  }

  /**
   * Parse complete FEED/BEEF frames from the incoming buffer and route them.
   */
  _processIncoming() {
    while (this._incomingBuffer.length >= 8) {
      let feedBeef;
      try {
        feedBeef = parseFeedBeef(this._incomingBuffer);
      } catch {
        // Not enough data or invalid — try to find next FEED header
        const idx = this._findNextFeed(1);
        if (idx < 0) {
          // No more FEED headers — keep buffer for next poll
          break;
        }
        // Skip to next FEED header
        this._incomingBuffer = this._incomingBuffer.subarray(idx);
        continue;
      }

      // Extract the inner Pebble Protocol frame
      const sppPayload = feedBeef.payload;
      this._incomingBuffer = this._incomingBuffer.subarray(feedBeef.totalLength);

      // Parse Pebble Protocol frame
      let ppPacket;
      try {
        ppPacket = parsePebblePacket(sppPayload);
      } catch {
        continue; // malformed PP frame, skip
      }

      // Route to pending resolver
      if (this._debug) {
        const hex = Array.from(ppPacket.payload.slice(0, 30)).map(b => b.toString(16).padStart(2, '0')).join(' ');
        console.log(`[bridge] received packet on endpoint 0x${ppPacket.endpoint.toString(16)}, ${ppPacket.payload.length} bytes: ${hex}`);
      }
      this._onPacket(ppPacket.endpoint, ppPacket.payload);
    }
  }

  /**
   * Find the next 0xFEED signature in the incoming buffer.
   */
  _findNextFeed(startOffset) {
    for (let i = startOffset; i < this._incomingBuffer.length - 1; i++) {
      if (this._incomingBuffer[i] === 0xFE && this._incomingBuffer[i + 1] === 0xED) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Route an incoming Pebble Protocol packet to the waiting promise.
   */
  _onPacket(endpoint, payload) {
    const pending = this._pendingResolvers.get(endpoint);
    if (pending) {
      clearTimeout(pending.timer);
      this._pendingResolvers.delete(endpoint);
      pending.resolve(new Uint8Array(payload));
    }
    // If no one is waiting, drop the packet (normal for unsolicited messages)
  }

  /**
   * Clean up — stop polling and free WASM memory.
   */
  destroy() {
    this._stopPolling();
    // Reject any pending resolvers
    for (const [endpoint, pending] of this._pendingResolvers) {
      clearTimeout(pending.timer);
      pending.reject(new Error('Bridge destroyed'));
    }
    this._pendingResolvers.clear();
  }
}
