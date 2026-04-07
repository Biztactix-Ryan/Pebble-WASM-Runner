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
│                               │ (FEED/BEEF)  │ │
│                               └──────┬───────┘ │
│                               ┌──────▼───────┐ │
│                               │ QEMU WASM    │ │
│                               │ (PebbleOS)   │ │
│                               └──────────────┘ │
└─────────────────────────────────────────────────┘
```

## Component Details

### 1. Emulator Bridge (FEED/BEEF Protocol)

**Source**: `hw/arm/pebble_control.c` in pebble-qemu-wasm

The existing QEMU Pebble emulator uses a control protocol over a virtual UART:
- **FEED prefix**: Host-to-emulator control packets
- **BEEF prefix**: Emulator-to-host response packets

We extend this to expose two JS-callable functions:
- `sendPebblePacket(protocolId, payload)` — inject a protocol packet into the emulator
- Register a callback to receive packets coming back out

This replaces the TCP proxy that the original desktop tools used.

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

**Source**: `libpebble2/services/install.py`

Transforms the PBW manifest into the metadata format expected by PebbleOS:
- UUID (16 bytes)
- App name (string)
- Company name (string)
- Version major/minor
- SDK version
- App flags (watchface vs app, etc.)
- Icon resource ID

### 4. PutBytes Engine

**Source**: `libpebble2/services/putbytes.py`

Handles chunked binary transfer to the emulator:

```
INIT   → declares transfer type, size, target slot
DATA   → sends binary in chunks (typ. 2000-byte chunks)
COMMIT → finalizes the transfer, CRC check
```

Each transfer type has a different object type code:
- App binary
- Resources
- Worker
- File (generic)

### 5. Installer

**Source**: `libpebble2/services/install.py` + `pebble_tool/commands/install.py`

Orchestrates the full sequence:
1. Send app metadata (AppFetch response with app info)
2. Wait for install slot assignment from PebbleOS
3. PutBytes: send app binary
4. PutBytes: send resources (if present)
5. PutBytes: send worker (if present)
6. Handle completion/error responses

### 6. Browser UI

Simple interface:
- File input for `.pbw` upload
- Display parsed metadata (name, version, company)
- "Install" button
- Progress bar during transfer
- Status messages (success/error)

## Protocol Message Types

Key Pebble protocol messages involved:

| Message | Direction | Purpose |
|---------|-----------|---------|
| AppFetch | Watch → Host | Requests an app to install |
| AppFetch Response | Host → Watch | Provides app metadata |
| PutBytes Init | Host → Watch | Start binary transfer |
| PutBytes Data | Host → Watch | Chunk of binary data |
| PutBytes Commit | Host → Watch | Finalize transfer |
| PutBytes Ack | Watch → Host | Acknowledge/status |
| AppRunState | Watch → Host | App started/stopped |

## Build Order Rationale

1. **Emulator Bridge** — everything else depends on being able to send/receive packets
2. **PBW Parser** — need data before we can install it
3. **Metadata Converter** — transforms parsed data into protocol format
4. **PutBytes** — core transport needed before full install
5. **Installer Flow** — ties everything together
6. **UI** — last because we can test everything via console first

---
*Last reviewed: 2026-04-07*
