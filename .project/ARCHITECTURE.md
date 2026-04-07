# Pebble WASM Runner — Architecture

## System Overview

```
┌─────────────────────────────────────────────────┐
│                    Browser                       │
│                                                  │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐ │
│  │ UI Layer │→ │ PBW       │→ │ Installer    │ │
│  │ (upload, │  │ Parser    │  │ (install.py  │ │
│  │  progress│  │ (JSZip)   │  │  port)       │ │
│  │  status) │  └───────────┘  └──────┬───────┘ │
│  └──────────┘                        │         │
│                               ┌──────▼───────┐ │
│                               │ PutBytes     │ │
│                               │ Engine       │ │
│                               │ (putbytes.py │ │
│                               │  port)       │ │
│                               └──────┬───────┘ │
│                               ┌──────▼───────┐ │
│                               │ Emulator     │ │
│                               │ Bridge       │ │
│                               │ (FEED/BEEF   │ │
│                               │  SPP type)   │ │
│                               └──────┬───────┘ │
│                               ┌──────▼───────┐ │
│                               │ QEMU WASM    │ │
│                               │ (PebbleOS)   │ │
│                               └──────────────┘ │
└─────────────────────────────────────────────────┘
```

## Component Details

### 1. Emulator Bridge (FEED/BEEF Protocol)

**Source**: `hw/arm/pebble_control.c` in pebble-qemu-wasm (branch: `main`)

The QEMU Pebble emulator uses a control protocol over a virtual UART with this packet framing:

```
┌──────────┬──────────────┬─────────────┬─────────┬──────────┐
│ 0xFEED   │ Protocol ID  │ Data Length  │ Payload │ 0xBEEF   │
│ (2 bytes)│ (2 bytes)    │ (2 bytes)    │ (N bytes)│ (2 bytes)│
└──────────┴──────────────┴─────────────┴─────────┴──────────┘
```

**Eight protocol types** (QemuProtocol enum in pebble_control.c):
| ID | Type | Description |
|----|------|-------------|
| 0 | SPP | **Serial Port Profile — carries raw Pebble Protocol data. This is what we use.** |
| 1 | Tap | Accelerometer tap events |
| 2 | BluetoothConnection | Connection state |
| 3 | Compass | Heading/calibration |
| 4 | Battery | Percentage/charger |
| 5 | Accel | Accelerometer samples |
| 6 | Vibration | Motor control |
| 7 | Button | Button state flags |

**Our bridge wraps Pebble protocol packets inside SPP-type FEED/BEEF frames.** The control channel in pebble_control.c already forwards SPP packets to the target UART — we extend it to allow JS-initiated injection and JS callback on outgoing packets.

**Existing JS surface** (from index.html):
- `Module._pebble_display_*()` — framebuffer access
- `Module._pebble_button_state_addr()` — button input via shared memory + Atomics
- Emscripten FS for firmware loading
- **No existing API for protocol packet send/receive** — this is what we build

**Note**: `build_wasm.sh` uses Docker + Emscripten. EXPORTED_FUNCTIONS are managed by the Emscripten build config, not listed directly in the shell script. `scripts/patch_wasm.py` patches Emscripten flags (optimization, asyncify, profiling).

### 2. PBW Parser

**No source dependency** — straightforward zip handling.

A `.pbw` file is a ZIP archive containing:
```
appinfo.json          — app manifest (name, uuid, version, etc.)
pebble-app.bin        — compiled app binary
app_resources.pbpack  — resource bundle (images, fonts)
worker.bin            — optional background worker
```

Output: structured JS object with parsed metadata + extracted binary buffers.

### 3. Metadata Converter

**Source**: `libpebble2/services/install.py`, `libpebble2/protocol/apps.py`

AppMetadata structure (from `libpebble2/protocol/apps.py`):

| Field | Type | Notes |
|-------|------|-------|
| uuid | UUID (16 bytes) | |
| app_version_major | Uint8 | |
| app_version_minor | Uint8 | |
| sdk_version_major | Uint8 | |
| sdk_version_minor | Uint8 | |
| flags | Uint32 | Watchface, worker, etc. |
| icon | Uint32 | Resource ID |
| app_face_bg_color | Uint8 | Background color |
| app_face_template_id | Uint8 | Face template |
| app_name | Fixed string (96 chars) | Null-padded |

### 4. PutBytes Engine

**Source**: `libpebble2/services/putbytes.py`, `libpebble2/protocol/transfers.py`

**Endpoint**: `0xBEEF`

**Five commands** (not four):

| Cmd | Byte | Name | Fields |
|-----|------|------|--------|
| INIT | 0x01 | PutBytesInit | object_size (Uint32), object_type (Uint8), bank (Uint8), filename (NullTermString) |
| INIT (modern) | 0x01 | PutBytesAppInit | object_size (Uint32), object_type (Uint8), app_id (Uint32) |
| PUT | 0x02 | PutBytesPut | cookie (Uint32), payload_size (Uint32), payload (bytes) |
| COMMIT | 0x03 | PutBytesCommit | cookie (Uint32), object_crc (Uint32) |
| ABORT | 0x04 | PutBytesAbort | cookie (Uint32) |
| INSTALL | 0x05 | PutBytesInstall | cookie (Uint32) |

**Two INIT variants:**
- `PutBytesInit` — legacy (v2), bank-based slot assignment
- `PutBytesAppInit` — modern (v3+), app_id-based

**Object types** (from `libpebble2/protocol/transfers.py`):
| Value | Type |
|-------|------|
| 0x01 | Firmware |
| 0x02 | Recovery |
| 0x03 | SystemResource |
| 0x04 | AppResource |
| 0x05 | AppExecutable |
| 0x06 | File |
| 0x07 | Worker |

**Chunk size**: 2000 bytes max per PUT message

**Response format**: result (Uint8: ACK=0x01, NACK=0x02) + cookie (Uint32)

**CRC**: **STM32 CRC-32** — NOT standard CRC32!
- Polynomial: `0x04C11DB7`
- Initial value: `0xFFFFFFFF`
- **No bit/byte reflection** (MSB-first processing)
- Processes in 4-byte word blocks
- Source: `libpebble2/util/stm32_crc.py`

### 5. Installer

**Source**: `libpebble2/services/install.py`, `libpebble2/protocol/apps.py`, `pebble_tool/commands/install.py`

**Two install paths exist in libpebble2:**

**Modern (v3+ firmware) — our target:**
1. Build `AppMetadata` from manifest
2. Insert metadata into **BlobDB** via `BlobDBClient`
3. Send `AppRunStateStart` (endpoint `0x34`) to trigger install
4. Receive `AppFetchRequest` (endpoint `0x1771`) from PebbleOS with UUID + app_id
5. Send `AppFetchResponse` (endpoint `0x1771`) with status=Start
6. PutBytes: app binary via `PutBytesAppInit` (uses app_id, not bank)
7. PutBytes: resources via `PutBytesAppInit` (if present)
8. PutBytes: worker via `PutBytesAppInit` (if present)

**Legacy (v2 firmware):**
1. Send UUID via legacy protocol
2. Query available banks → find free slot
3. PutBytes: app binary via `PutBytesInit` (uses bank index)
4. PutBytes: resources and worker
5. Mark bank as available
6. Launch via AppMessage

**Key protocol endpoints:**
| Endpoint | ID | Direction |
|----------|-----|-----------|
| PutBytes | `0xBEEF` | Host → Watch (commands), Watch → Host (ACKs) |
| AppRunState | `0x34` | Both — start/stop/request |
| AppFetch | `0x1771` | Watch → Host (request), Host → Watch (response) |

**AppFetch response codes:**
| Value | Meaning |
|-------|---------|
| 0 | Start (proceed with install) |
| 1 | Busy |
| 2 | InvalidUUID |
| 3 | NoData |

**pebble-tool's role** (`pebble_tool/commands/install.py`):
- Just a CLI wrapper — calls `AppInstaller(pebble, pbw)` from libpebble2
- Tracks progress via handler registration
- Also supports WebSocket path (cloud sync) — we ignore this

### 6. Additional Protocol: BlobDB

**Source**: `libpebble2/services/blobdb.py` (need to research)

The modern install path requires inserting app metadata into PebbleOS's BlobDB before triggering the AppFetch flow. This is a separate protocol we need to port.

### 7. Browser UI

Simple interface — file upload, metadata display, install button, progress bar, status messages.

## Source File Reference Map

| Our Component | Source File | What We Read |
|---------------|-----------|--------------|
| Bridge | `hw/arm/pebble_control.c` | FEED/BEEF framing, protocol types, SPP forwarding |
| Bridge | `hw/arm/pebble_control.h` | Control API: `pebble_control_create()` |
| Bridge | `hw/arm/pebble.c` | UART creation, board config, button handling |
| Bridge | `build_wasm.sh` | Docker build process, Emscripten config |
| Bridge | `scripts/patch_wasm.py` | Emscripten flags, optimization, asyncify |
| Bridge | `index.html` (in `web/`) | Existing JS API surface |
| Metadata | `libpebble2/protocol/apps.py` | AppMetadata, AppRunState, AppFetch message definitions |
| PutBytes | `libpebble2/protocol/transfers.py` | PutBytes/GetBytes message definitions, object types |
| PutBytes | `libpebble2/services/putbytes.py` | PutBytes state machine, chunking, CRC usage |
| CRC | `libpebble2/util/stm32_crc.py` | STM32 CRC-32 algorithm |
| Installer | `libpebble2/services/install.py` | Install state machine (modern + legacy paths) |
| Installer | `libpebble2/services/blobdb.py` | BlobDB metadata insertion (modern path) |
| CLI ref | `pebble_tool/commands/install.py` | Top-level install command flow |

## Build Order Rationale

1. **Emulator Bridge** — everything else depends on being able to send/receive packets
2. **PBW Parser** — need data before we can install it
3. **Metadata Converter** — transforms parsed data into protocol format
4. **PutBytes** — core transport needed before full install
5. **Installer Flow** — ties everything together
6. **UI** — last because we can test everything via console first

---
*Last reviewed: 2026-04-07*