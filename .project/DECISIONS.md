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

## ADR-002: Use FEED/BEEF control protocol as the JS↔emulator bridge

**Decision**: Extend the existing FEED/BEEF UART control protocol in pebble-qemu-wasm rather than building a new communication channel.

**Context**: The QEMU Pebble emulator already has a control protocol over a virtual UART (`pebble_control.c`). We need a way for browser JS to send Pebble protocol packets into the emulator.

**Rationale**:
- Infrastructure already exists in the C codebase
- Avoids adding new QEMU device types or shared memory regions
- FEED/BEEF is already understood by the emulator
- Just needs JS-callable wrappers exposed via Emscripten

**Status**: Accepted — 2026-04-07

---

## ADR-003: Minimal first milestone — app binary only

**Decision**: First working version supports only app binary installation. Resources, worker binaries, uninstall, and advanced metadata are deferred.

**Context**: A full install includes app binary + resources + worker. Many simple apps/watchfaces work with just the binary.

**Rationale**:
- Validates the entire pipeline end-to-end with minimal scope
- PutBytes engine works the same for all transfer types — adding resources/worker is incremental
- Faster to get something working and iterate

**Status**: Accepted — 2026-04-07

---

## ADR-004: Reference repos are read-only — we port, not fork

**Decision**: pebble-tool and libpebble2 are reference material only. We read their logic and port it to JS. We do not fork, modify, or include them as dependencies.

**Context**: The Pebble repos contain the install protocol implementation in Python.

**Rationale**:
- Python code can't run in the browser without heavy tooling
- Porting gives us clean JS that integrates naturally with the browser environment
- We maintain a single language for the browser-side code
- Reference repos may be archived/unmaintained — we need to own the code

**Status**: Accepted — 2026-04-07

---

## ADR-005: Build order — bridge first, UI last

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
*Last reviewed: 2026-04-07*
