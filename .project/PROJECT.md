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
| **Pebble Control Bridge** | FEED/BEEF protocol handler bridging host JS ↔ emulated UART |
| **PBW Parser** | Reads `.pbw` zip bundles, extracts manifest, binaries, resources |
| **Metadata Converter** | Transforms PBW manifest into Pebble install protocol metadata |
| **PutBytes Engine** | Chunked binary transfer protocol (INIT → DATA → COMMIT) |
| **Installer** | Orchestrates the full install flow: metadata → slot → binary → resources → worker |
| **Browser UI** | File upload, install button, progress display, error handling |

### Data Flow

```
User uploads .pbw
  → JS unzips bundle (JSZip)
  → Parses appinfo.json / manifest
  → Extracts app binary, resources, worker
  → Converts metadata to install protocol format
  → Installer sends install packets via bridge:
      1. Insert app metadata
      2. Request install slot
      3. PutBytes: app binary (chunked)
      4. PutBytes: resources (chunked)
      5. PutBytes: worker (chunked)
  → Packets flow through FEED/BEEF control protocol
  → QEMU UART delivers them to PebbleOS
  → PebbleOS installs and runs the app
  → Responses flow back through bridge to JS for progress/errors
```

## Key Decisions

- **Port install logic to JS (not Python-in-WASM)** — Simpler, smaller, no CPython runtime needed. The protocol is straightforward enough to reimplement. — 2026-04-07
- **Use FEED/BEEF control protocol as the bridge** — Already exists in pebble-qemu-wasm for host↔emulator communication. Extend it rather than building a new channel. — 2026-04-07
- **Reference pebble-tool for command flow only** — The real protocol logic lives in libpebble2. pebble-tool is just the CLI entry point. — 2026-04-07
- **Minimal first milestone** — Ship upload + parse + install single app binary first. Defer resources, worker, uninstall, and advanced metadata. — 2026-04-07

## Dependencies

| Dependency | Purpose |
|-----------|---------|
| [pebble-qemu-wasm](https://github.com/ericmigi/pebble-qemu-wasm) | Base WASM QEMU emulator with Pebble hardware support |
| [libpebble2](https://github.com/pebble/libpebble2) | Reference for install protocol, PutBytes, and message definitions |
| [pebble-tool](https://github.com/pebble/pebble-tool) | Reference for install command flow |
| JSZip | Browser-side zip extraction for .pbw files |

## Development Setup

### Prerequisites
- Emscripten SDK (for QEMU WASM build)
- PebbleOS firmware image
- Modern browser with WebAssembly support

### Build
```bash
# Build QEMU for WASM
./build_wasm.sh

# Serve locally
python3 -m http.server 8000
# Open http://localhost:8000/index.html
```

## Source Repositories (Reference Only)

These repos are read for protocol understanding — we port their logic to JS:

| Repo | What We Use |
|------|------------|
| `pebble/libpebble2` → `services/install.py` | Full install sequence, metadata insertion, slot handling |
| `pebble/libpebble2` → `services/putbytes.py` | Chunked binary transfer protocol |
| `pebble/libpebble2` → protocol definitions | Message formats for AppFetch, PutBytes, AppRunState |
| `pebble/pebble-tool` → `commands/install.py` | Top-level install command flow |

---
*Last reviewed: 2026-04-07*
