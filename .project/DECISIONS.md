# Pebble WASM Runner — Decisions Log

## ADR-001: Port install logic to JavaScript, not Python-in-WASM

**Decision**: Reimplement the Pebble install protocol in JavaScript rather than running the Python libpebble2 in the browser.

**Context**: libpebble2 (Python) contains the authoritative install protocol logic. Options were: (a) compile CPython to WASM and run libpebble2 directly, (b) port the logic to JS.

**Rationale**:
- The install protocol is well-defined and not excessively complex
- CPython-in-WASM adds ~10MB+ to the page and significant startup time
- JS has native access to the browser APIs we need (File, ArrayBuffer, etc.)
- Easier to debug and maintain
- No Python dependency management in the browser

**Status**: Accepted — 2026-04-07

---

## ADR-002: Use FEED/BEEF SPP protocol type as the JS-to-emulator bridge

**Decision**: Inject Pebble protocol packets via the SPP (Serial Port Profile) protocol type within the existing FEED/BEEF control channel, rather than building a new communication channel.

**Context**: The QEMU Pebble emulator has a control protocol over a virtual UART (`pebble_control.c`) with 8 protocol types. SPP (type 0) carries raw Pebble protocol data and is already forwarded to the emulated UART. We need JS to send/receive Pebble protocol messages.

**Rationale**:
- SPP forwarding infrastructure already exists in pebble_control.c
- Avoids adding new QEMU device types or shared memory regions
- Just needs JS-callable wrappers exposed via Emscripten
- Packet framing is well-defined: `0xFEED + proto_id + length + data + 0xBEEF`

**Status**: Accepted — 2026-04-07

---

## ADR-003: Target modern (v3+) install path, not legacy (v2)

**Decision**: Implement the modern firmware (v3+) install path using BlobDB + AppFetch + PutBytesAppInit, not the legacy v2 bank-based path.

**Context**: libpebble2/services/install.py has two install paths:
- **Modern (v3+)**: BlobDB metadata insert → AppRunState → AppFetchRequest → PutBytesAppInit (app_id based)
- **Legacy (v2)**: UUID notify → query banks → find free slot → PutBytesInit (bank based) → mark available

The emulator firmware version determines which path is needed.

**Rationale**:
- The WASM emulator runs modern PebbleOS firmware (v3+/v4)
- Modern path is cleaner — no bank slot management needed
- Uses `PutBytesAppInit` with app_id instead of `PutBytesInit` with bank index
- Legacy path only needed for v2 firmware which the emulator doesn't run
- We still need BlobDB protocol support for metadata insertion

**Status**: Accepted — 2026-04-07

---

## ADR-004: Minimal first milestone — app binary only

**Decision**: First working version supports only app binary installation. Resources, worker binaries, uninstall, and advanced metadata are deferred.

**Context**: A full install includes app binary + resources + worker. Many simple apps/watchfaces work with just the binary.

**Rationale**:
- Validates the entire pipeline end-to-end with minimal scope
- PutBytes engine works the same for all transfer types — adding resources/worker is incremental
- Faster to get something working and iterate

**Status**: Accepted — 2026-04-07

---

## ADR-005: Reference repos are read-only — we port, not fork

**Decision**: pebble-tool and libpebble2 are reference material only. We read their logic and port it to JS. We do not fork, modify, or include them as dependencies.

**Context**: The Pebble repos contain the install protocol implementation in Python.

**Rationale**:
- Python code can't run in the browser without heavy tooling
- Porting gives us clean JS that integrates naturally with the browser environment
- We maintain a single language for the browser-side code
- Reference repos may be archived/unmaintained — we need to own the code

**Status**: Accepted — 2026-04-07

---

## ADR-006: Build order — bridge first, UI last

**Decision**: Implementation order is: emulator bridge → PBW parser → metadata → PutBytes → installer → UI.

**Context**: Need to decide which component to build first.

**Rationale**:
- Bridge is the foundation — nothing works without packet I/O
- Parser is independent and gives us test data early
- PutBytes and installer depend on the bridge
- UI is last because everything can be tested via browser console first
- This order minimizes blocked dependencies

**Status**: Accepted — 2026-04-07

---

## ADR-007: Use STM32 CRC-32, not standard CRC32

**Decision**: Implement the STM32-specific CRC-32 algorithm for PutBytes COMMIT messages, matching the implementation in `libpebble2/util/stm32_crc.py`.

**Context**: PebbleOS uses STM32 hardware CRC which differs from standard CRC32. The differences are significant enough that standard CRC32 will cause install failures.

**Rationale**:
- STM32 CRC uses polynomial `0x04C11DB7` (same as standard)
- BUT: no bit/byte reflection (MSB-first), processes in 4-byte word blocks
- Standard CRC32 reflects both input and output — will produce wrong values
- Must match exactly or PebbleOS will reject the COMMIT
- Reference implementation: `libpebble2/util/stm32_crc.py`

**Status**: Accepted — 2026-04-07

---
*Last reviewed: 2026-04-07*