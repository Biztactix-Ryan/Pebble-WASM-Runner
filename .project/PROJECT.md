# Pebble WASM Runner (PWR)

A browser-based PebbleOS emulator with app installation support. Users can upload `.pbw` files (Pebble apps/watchfaces), install them into a WASM-compiled QEMU Pebble emulator, and run them — entirely in the browser with no server or hardware required.

## Architecture

### Tech Stack

- **Emulator**: QEMU 10.x compiled to WASM (via Emscripten/Docker) running PebbleOS ARM firmware
- **Languages**: C (QEMU/emulator), JavaScript (browser-side installer & UI)
- **Key Libraries**: JSZip (PBW extraction), Emscripten (WASM compilation)
- **UI**: Plain HTML/JS with sidebar, collapsible console, watch-image overlay

### Components

| Component | Responsibility | Status |
|-----------|---------------|--------|
| **QEMU WASM Emulator** | Runs PebbleOS ARM firmware in browser via WebAssembly | Working |
| **Pebble Control Bridge** | FEED/BEEF SPP protocol — JS inject + WASM outbox polling | Working |
| **PBW Parser** | Reads `.pbw` zip bundles, extracts manifest, binaries, resources | Working |
| **Metadata Converter** | Transforms PBW manifest into AppMetadata structure for BlobDB | Working |
| **PutBytes Engine** | Chunked binary transfer (AppInit → Put → Commit → Install) with STM32 CRC-32 | Working |
| **Installer Orchestrator** | Modern v3+ flow: BlobDB → AppRunState → AppFetch → PutBytes | Working |
| **Browser UI** | Sidebar with hardware/firmware selectors, install section, console panel | Working |

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

### Supported Platforms

| Platform | Machine | MCU | Status |
|----------|---------|-----|--------|
| snowy-emery (Snowy/Emery) | pebble-snowy-emery-bb | STM32F4xx | Boots |
| robert (Pebble 2) | pebble-robert-bb | STM32F7xx | Boots, clock mismatch with emery firmware |
| chalk (Pebble Time Round) | pebble-s4-bb | STM32F4xx | Untested |
| aplite | pebble-bb2 | STM32F3xx | Untested |
| diorite/flint | pebble-silk-bb | STM32F4xx | Untested |

### Firmware Sources

| Name | Path | Source | Status |
|------|------|--------|--------|
| full | web/firmware/full/ | Pebble SDK 4.9.77 | Boots, install flow starts but AppFetchRequest never arrives |
| sdk | web/firmware/sdk/ | Pebble SDK 4.9.77 | Boots, same issue as full |
| emery-cloud | web/firmware/emery-cloud/ | cloudpebble qemu-tintin-images | Boots, expects pypkjs companion (status=0xf) |

### JS/WASM Bridge API

```javascript
// Send packets into emulator (via UART injection)
Module._pebble_control_inject_wasm(ptr, len)

// Read packets from emulator (outbox polling)
Module._pebble_control_read_wasm(ptr, maxLen)
Module._pebble_control_readable_wasm()  // returns available byte count

// Button state via shared memory/Atomics
Module._pebble_button_state_addr()        // returns address of shared state
Module._pebble_set_buttons(state)        // bitmask: 0x1=back, 0x2=up, 0x4=select, 0x8=down

// Diagnostic
Module._pebble_control_status_wasm()     // returns state bitmask
Module._pebble_control_test_outbox()      // writes test frame to outbox
```

### Install Flow (Modern v3+)

```
1. BlobDB INSERT (app metadata) → endpoint 0xB1DB
2. AppRunState Start → endpoint 0x34 (fire-and-forget)
3. Wait for AppFetchRequest → endpoint 0x1771 (firmware requests the app)
4. AppFetchResponse (status=Start) → endpoint 0x1771
5. PutBytes: app binary → endpoint 0xBEEF
6. PutBytes: resources → endpoint 0xBEEF
7. PutBytes: worker → endpoint 0xBEEF
```

## Current Blocker

**AppFetchRequest (0x1771) never arrives from SDK firmware** — the firmware boots, BlobDB insert succeeds, AppRunState fires, but the firmware never sends the AppFetch request that triggers PutBytes.

**CloudPebble firmware** works differently — it expects a pypkjs companion JavaScript runtime that connects via "bluetooth" (TCP port 12344) and completes the AppFetch handshake. Without pypkjs, firmware sits at `status=0xf` (waiting for peer).

**Options to resolve:**
1. Implement pypkjs companion protocol in JS (fake TCP bridge for WASM)
2. Find why SDK firmware doesn't send AppFetchRequest (possibly firmware bug or missing step)
3. Use coredevices/PebbleOS source and build a firmware that speaks the simpler serial protocol

## Key Decisions

- **Port install logic to JS** — Simpler than Python-in-WASM, smaller footprint — 2026-04-07
- **Use FEED/BEEF SPP protocol type** — SPP (type 0) already forwards to UART, just needs JS wrappers — 2026-04-07
- **Target modern v3+ install path** — Emulator runs modern firmware; uses BlobDB + PutBytesAppInit — 2026-04-07
- **STM32 CRC-32, not standard CRC32** — PebbleOS uses STM32 hardware CRC (no reflection, MSB-first) — 2026-04-07
- **Minimal first milestone** — App binary only first, defer resources/worker/uninstall — 2026-04-07
- **Reference repos are read-only** — We port logic to JS, not fork — 2026-04-07
- **WASM bridge uses polling, not callbacks** — `_pebble_control_readable_wasm` + `_pebble_control_read_wasm` with 16ms poll interval — 2026-04-07
- **Robert (F7xx) board added** — STM32F7xx support via `pebble_stm32f7xx_soc.c` + `pebble_robert.c` — 2026-04-09
- **CloudPebble emery firmware downloaded** — `web/firmware/emery-cloud/` with 896KB micro + 16MB SPI flash — 2026-04-09

## Dependencies

| Dependency | Purpose |
|-----------|---------|
| [pebble-qemu-wasm](https://github.com/ericmigi/pebble-qemu-wasm) | Base WASM QEMU emulator — **our working codebase** (branch: `main`) |
| [libpebble2](https://github.com/pebble/libpebble2) | Reference: install protocol, PutBytes, BlobDB, message definitions |
| [pebble-tool](https://github.com/pebble/pebble-tool) | Reference: install command flow |
| [coredevices/PebbleOS](https://github.com/coredevices/PebbleOS) | Reference: open-source firmware source (waf build, STM32F4xx/SF32LB) |
| [coredevices/cloudpebble](https://github.com/coredevices/cloudpebble) | Reference: pypkjs + emulator controller + prebuilt firmware |
| JSZip | Browser-side zip extraction for .pbw files |

## Development Setup

### Prerequisites
- Docker (for WASM build via build_wasm.sh)
- Emscripten SDK (inside Docker container)
- PebbleOS firmware image
- Modern browser with WebAssembly support
- Node.js (for unit tests via npm)
- Python 3 (for local HTTP server)

### Build
```bash
# Build QEMU for WASM (uses Docker)
cd pebble-qemu-wasm
bash build_wasm.sh

# Serve locally
cd web
python3 -m http.server 8443
# Open http://localhost:8443/index.html
```

### Rebuild after source changes
```bash
# Native build (fast, for testing changes to device models)
cd pebble-qemu-wasm
bash build.sh

# WASM build (for browser)
bash build_wasm.sh
```

## Source File Reference

### pebble-qemu-wasm — working codebase

| File | What It Does |
|------|-------------|
| `hw/arm/pebble_control.c` | FEED/BEEF framing, 8 protocol types, SPP forwarding, WASM outbox |
| `hw/arm/pebble_control.h` | Control API: `pebble_control_create()` |
| `hw/arm/pebble.c` | Board configs, UART creation, button handling, WASM exports |
| `hw/arm/pebble_stm32f4xx_soc.c` | F4xx SoC init (168MHz SYSCLK) |
| `hw/arm/pebble_stm32f7xx_soc.c` | F7xx SoC init (200MHz SYSCLK) |
| `hw/arm/pebble_robert.c` | Robert board init (STM32F7xx) |
| `hw/arm/pebble_silk.c` | Silk board init |
| `build_wasm.sh` | Docker + Emscripten WASM build |
| `build.sh` | Native QEMU 10.x build |
| `scripts/patch_wasm.py` | Emscripten flag patches |
| `web/index.html` | Main UI with sidebar, console, install section |
| `lib/*.mjs` | JS protocol implementations (bridge, protocol, putbytes, installer, parser) |

### libpebble2 — read-only reference

| File | What We Port |
|------|-------------|
| `libpebble2/services/install.py` | Install state machine (modern v3+ path) |
| `libpebble2/services/putbytes.py` | PutBytes 4-stage flow, chunking, CRC usage |
| `libpebble2/services/blobdb.py` | BlobDB metadata insertion protocol |
| `libpebble2/protocol/transfers.py` | PutBytes/GetBytes message definitions |
| `libpebble2/protocol/apps.py` | AppMetadata, AppRunState, AppFetch |
| `libpebble2/util/stm32_crc.py` | STM32 CRC-32 algorithm |

---
*Last reviewed: 2026-04-09*
