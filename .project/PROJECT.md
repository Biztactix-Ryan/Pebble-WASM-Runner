# Pebble WASM Runner (PWR)

A browser-based PebbleOS emulator with app installation support. Users can upload `.pbw` files (Pebble apps/watchfaces), install them into a WASM-compiled QEMU Pebble emulator, and run them — entirely in the browser with no server or hardware required.

## Architecture

### Tech Stack

- **Emulator**: QEMU compiled to WASM (via Emscripten) running PebbleOS firmware
- **Language**: C (QEMU/emulator), JavaScript (browser-side installer & UI)
- **Key Libraries**: JSZip (PBW extraction), Emscripten (WASM compilation)
- **UI**: Plain HTML/JS (embedded in index.html)

### Components

| Component | Responsibility |
|-----------|---------------|
| **QEMU WASM Emulator** | Runs PebbleOS ARM firmware in the browser via WebAssembly |
| **Pebble Control Bridge** | FEED/BEEF protocol handler — SPP type carries Pebble protocol data between JS and emulated UART |
| **PBW Parser** | Reads `.pbw` zip bundles, extracts manifest, binaries, resources |
| **Metadata Converter** | Transforms PBW manifest into AppMetadata structure for BlobDB insertion |
| **PutBytes Engine** | Chunked binary transfer protocol (AppInit → Put → Commit → Install) with STM32 CRC-32 |
| **Installer** | Orchestrates modern v3+ install: BlobDB → AppRunState → AppFetch → PutBytes |
| **Browser UI** | File upload, install button, progress display, error handling |

### Data Flow

```
User uploads .pbw
  → JS unzips bundle (JSZip)
  → Parses appinfo.json / manifest
  → Extracts app binary, resources, worker
  → Converts metadata to AppMetadata format
  → Installer orchestrates via modern (v3+) path:
      1. Insert AppMetadata into BlobDB
      2. Send AppRunStateStart (endpoint 0x34)
      3. Receive AppFetchRequest (endpoint 0x1771) with app_id
      4. Send AppFetchResponse (status=Start)
      5. PutBytesAppInit: app binary (chunked, 2000B, STM32 CRC-32)
      6. PutBytesAppInit: resources (if present)
      7. PutBytesAppInit: worker (if present)
  → All packets wrapped in FEED/BEEF SPP frames
  → pebble_control.c forwards SPP to emulated UART
  → PebbleOS installs and runs the app
  → Responses flow back through bridge to JS
```

## Key Decisions

- **Port install logic to JS** — Simpler than Python-in-WASM, smaller footprint — 2026-04-07
- **Use FEED/BEEF SPP protocol type** — SPP (type 0) already forwards to UART, just needs JS wrappers — 2026-04-07
- **Target modern v3+ install path** — Emulator runs modern firmware; uses BlobDB + PutBytesAppInit — 2026-04-07
- **STM32 CRC-32, not standard CRC32** — PebbleOS uses STM32 hardware CRC (no reflection, MSB-first) — 2026-04-07
- **Minimal first milestone** — App binary only first, defer resources/worker/uninstall — 2026-04-07
- **Reference repos are read-only** — We port logic to JS, not fork — 2026-04-07

## Dependencies

| Dependency | Purpose |
|-----------|---------|
| [pebble-qemu-wasm](https://github.com/ericmigi/pebble-qemu-wasm) | Base WASM QEMU emulator — **our working codebase** (branch: `main`) |
| [libpebble2](https://github.com/pebble/libpebble2) | Reference: install protocol, PutBytes, BlobDB, message definitions |
| [pebble-tool](https://github.com/pebble/pebble-tool) | Reference: install command flow (thin wrapper around libpebble2) |
| JSZip | Browser-side zip extraction for .pbw files |

## Development Setup

### Prerequisites
- Docker (for WASM build via build_wasm.sh)
- Emscripten SDK (inside Docker container)
- PebbleOS firmware image
- Modern browser with WebAssembly support
- Node.js (for running unit tests)
- Playwright (for headless integration/UI tests)

### Build
```bash
# Build QEMU for WASM (uses Docker)
./build_wasm.sh

# Serve locally
python3 -m http.server 8000 --directory web/
# Open http://localhost:8000/index.html
```

## Source File Reference Map

### pebble-qemu-wasm (branch: main) — working codebase

| File | What It Does | What We Modify |
|------|-------------|----------------|
| `hw/arm/pebble_control.c` | FEED/BEEF framing, 8 protocol types, SPP forwarding | Add JS-callable packet send/receive |
| `hw/arm/pebble_control.h` | Control API: `pebble_control_create()` | Add new function declarations |
| `hw/arm/pebble.c` | Board configs (snowy/emery/s4), UART creation, buttons | Reference only |
| `build_wasm.sh` | Docker + Emscripten build process | Add new EXPORTED_FUNCTIONS |
| `scripts/patch_wasm.py` | Emscripten flags, optimization, asyncify | May need export additions |
| `web/index.html` | Emulator UI, display/button JS APIs | Add installer UI + JS modules |

### libpebble2 — read-only reference

| File | What We Port |
|------|-------------|
| `libpebble2/services/install.py` | Install state machine (modern v3+ path) |
| `libpebble2/services/putbytes.py` | PutBytes 4-stage flow, chunking, CRC usage |
| `libpebble2/services/blobdb.py` | BlobDB metadata insertion protocol |
| `libpebble2/protocol/transfers.py` | PutBytes/GetBytes message definitions, object types |
| `libpebble2/protocol/apps.py` | AppMetadata, AppRunState, AppFetch messages |
| `libpebble2/util/stm32_crc.py` | STM32 CRC-32 algorithm |

### pebble-tool — read-only reference

| File | What We Learn |
|------|--------------|
| `pebble_tool/commands/install.py` | CLI flow — just calls `AppInstaller(pebble, pbw)` + progress tracking |

---
*Last reviewed: 2026-04-07*