# App Install Sequence Specification

> Derived from `libpebble2/services/install.py`, `libpebble2/services/blobdb.py`, `libpebble2/protocol/apps.py`, `libpebble2/protocol/blobdb.py`, and `libpebble2/util/bundle.py`

## Overview

Installing a PBW app on PebbleOS v3+ uses a multi-stage protocol involving three Pebble Protocol endpoints:

1. **BlobDB** (endpoint `0xB1DB`) — insert app metadata
2. **AppRunState** (endpoint `0x0034`) — trigger the install
3. **AppFetch** (endpoint `0x1771`) — firmware requests binary data
4. **PutBytes** (endpoint `0xBEEF`) — transfer app binary, resources, and worker

All of these are wrapped in Pebble Protocol frames (length + endpoint + payload), then inside FEED/BEEF SPP frames for QEMU transport.

## PBW File Structure

A PBW is a ZIP archive containing:

```
manifest.json          — describes contents (application, resources, worker)
emery/                 — platform-specific directory (emery for our target)
  pebble-app.bin       — application binary
  app_resources.pbpack — resource pack (if present)
  worker.bin           — background worker (if present)
appinfo.json           — app metadata (universal)
```

The `manifest.json` has keys: `application`, `resources` (optional), `worker` (optional), each with a `name` field pointing to the file path within the ZIP.

Platform search order for emery: `emery/` → `basalt/` → root (`""`).

### App Binary Header

The first bytes of the app binary contain metadata (little-endian):

| Offset | Size | Field |
|--------|------|-------|
| 0 | 8 | Sentinel ("PBLAPP\0\0") |
| 8 | 2 | Struct version (major, minor) |
| 10 | 2 | SDK version (major, minor) |
| 12 | 2 | App version (major, minor) |
| 14 | 2 | Size (uint16) |
| 16 | 4 | Offset (uint32) |
| 20 | 4 | CRC (uint32) |
| 24 | 32 | App name (null-padded) |
| 56 | 32 | Company name (null-padded) |
| 88 | 4 | Icon resource ID (uint32) |
| 92 | 4 | Symbol table address (uint32) |
| 96 | 4 | Flags (uint32) |
| 100 | 4 | Num relocation entries (uint32) |
| 104 | 16 | UUID (bytes) |

## Modern Install Sequence (v3+ firmware — our target)

```
Host                                    PebbleOS
  |                                       |
  |  1. BlobDB INSERT (App db, uuid,      |
  |     AppMetadata serialised)           |
  |-------------------------------------->|
  |<--------------------------------------| BlobDB Response (Success)
  |                                       |
  |  2. AppRunState Start (uuid)          |
  |-------------------------------------->|
  |                                       | [firmware looks up app, needs binary]
  |<--------------------------------------| 3. AppFetchRequest (uuid, app_id)
  |                                       |
  |  4. AppFetchResponse (status=Start)   |
  |-------------------------------------->|
  |                                       |
  |  5. PutBytes: app binary              |
  |    INIT → [PUT chunks] → COMMIT →     |
  |    INSTALL                            |
  |-------------------------------------->|
  |                                       |
  |  6. PutBytes: resources (if present)  |
  |    INIT → [PUT chunks] → COMMIT →     |
  |    INSTALL                            |
  |-------------------------------------->|
  |                                       |
  |  7. PutBytes: worker (if present)     |
  |    INIT → [PUT chunks] → COMMIT →     |
  |    INSTALL                            |
  |-------------------------------------->|
  |                                       | [app launches]
```

### Step 1: BlobDB Insert (App Metadata)

**Endpoint**: `0xB1DB` (little-endian)

Insert the app's metadata into the App database so PebbleOS knows about it.

**BlobCommand (Insert)**:
```
+--------+--------+--------+--------+--------+--------+-- key --+--------+--------+-- value --+
| cmd    | token (uint16 LE)| db_id  | key_sz | key (16B UUID)   | val_sz (uint16 LE)| value    |
+--------+--------+--------+--------+--------+--------+---------+--------+--------+-----------+
```

| Field | Size | Value |
|-------|------|-------|
| command | 1 | `0x01` (Insert) |
| token | 2 | Random uint16 (for matching response) |
| database | 1 | `0x02` (App) |
| key_size | 1 | `16` |
| key | 16 | App UUID bytes |
| value_size | 2 | Size of serialised AppMetadata |
| value | var | Serialised AppMetadata |

**AppMetadata** (little-endian):

| Field | Size | Description |
|-------|------|-------------|
| uuid | 16 | App UUID |
| flags | 4 | App flags from binary header |
| icon | 4 | Icon resource ID |
| app_version_major | 1 | |
| app_version_minor | 1 | |
| sdk_version_major | 1 | |
| sdk_version_minor | 1 | |
| app_face_bg_color | 1 | `0` |
| app_face_template_id | 1 | `0` |
| app_name | 96 | Fixed-length string |

**BlobDB Response**:
```
+--------+--------+--------+
| token (uint16 LE)| status |
+--------+--------+--------+
```

| Status | Value |
|--------|-------|
| Success | `0x01` |
| GeneralFailure | `0x02` |
| InvalidOperation | `0x03` |
| InvalidDatabaseID | `0x04` |
| InvalidData | `0x05` |
| KeyDoesNotExist | `0x06` |
| DatabaseFull | `0x07` |
| DataStale | `0x08` |
| NotSupported | `0x09` |
| Locked | `0x0A` |
| TryLater | `0x0B` |

If status is `TryLater`, retry after timeout. Any other non-Success status is fatal.

### Step 2: AppRunState Start

**Endpoint**: `0x0034` (little-endian)

Tells PebbleOS to start the app. Since the app isn't installed yet, PebbleOS will request the binary.

```
+--------+-- uuid (16 bytes) --+
| cmd    | app UUID             |
+--------+---------------------+
```

| Field | Size | Value |
|-------|------|-------|
| command | 1 | `0x01` (Start) |
| uuid | 16 | App UUID |

Other commands (for reference):
- `0x02` = Stop
- `0x03` = Request (query running state)

### Step 3: AppFetchRequest (from firmware)

**Endpoint**: `0x1771` (little-endian)

The firmware responds with a fetch request, providing the `app_id` to use for PutBytes.

```
+--------+-- uuid (16 bytes) --+--------+--------+--------+--------+
| cmd    | app UUID             | app_id (int32 LE)                 |
+--------+---------------------+--------+--------+--------+--------+
```

| Field | Size | Value |
|-------|------|-------|
| command | 1 | `0x01` |
| uuid | 16 | App UUID (must match what we sent) |
| app_id | 4 | Install ID assigned by firmware (signed int32, LE) |

**Validation**: If the UUID doesn't match, send AppFetchResponse with `InvalidUUID` and abort.

### Step 4: AppFetchResponse

**Endpoint**: `0x1771` (little-endian)

```
+--------+--------+
| cmd    | status |
+--------+--------+
```

| Field | Size | Value |
|-------|------|-------|
| command | 1 | `0x01` |
| response | 1 | Status code |

| Status | Value |
|--------|-------|
| Start | `0x01` |
| Busy | `0x02` |
| InvalidUUID | `0x03` |
| NoData | `0x04` |

Send `Start` to proceed with the transfer.

### Steps 5-7: PutBytes Transfers

Transfer each component using the PutBytes protocol (see `PUTBYTES_PROTOCOL.md`):

| Order | Type | object_type | Data Source |
|-------|------|-------------|-------------|
| 1 | App binary | `0x85` (Binary + bit7) | `manifest.application.name` |
| 2 | Resources | `0x84` (Resources + bit7) | `manifest.resources.name` |
| 3 | Worker | `0x87` (Worker + bit7) | `manifest.worker.name` |

All use `PutBytesAppInit` (modern path) with the `app_id` from the AppFetchRequest.

The `object_type` has bit 7 set (e.g., Binary=5 becomes `0x85`) to signal the modern app-id-based init variant.

Resources and worker are only sent if present in the manifest.

## Endianness Summary

| Protocol | Endianness |
|----------|------------|
| FEED/BEEF framing | Big-endian |
| Pebble Protocol frame (length + endpoint) | Big-endian |
| PutBytes messages | Big-endian |
| BlobDB messages | **Little-endian** |
| AppRunState messages | **Little-endian** |
| AppFetch messages | **Little-endian** |
| AppMetadata | **Little-endian** |

## Error Handling

| Stage | Error | Recovery |
|-------|-------|----------|
| BlobDB Insert | NACK / non-Success | Abort install |
| BlobDB Insert | TryLater | Retry after timeout |
| AppRunState | Wrong UUID in AppFetch | Send InvalidUUID response, abort |
| PutBytes | NACK on any command | Abort (send PutBytesAbort if cookie obtained) |

## Source References

| File | Key Content |
|------|-------------|
| `libpebble2/services/install.py:72-104` | Modern install sequence (_install_modern) |
| `libpebble2/services/install.py:42-53` | PBW bundle preparation, total size calculation |
| `libpebble2/services/blobdb.py:59-74` | BlobDB insert with token/callback |
| `libpebble2/protocol/blobdb.py:13-17` | InsertCommand fields |
| `libpebble2/protocol/blobdb.py:38-51` | BlobCommand structure |
| `libpebble2/protocol/blobdb.py:54-65` | BlobStatus enum |
| `libpebble2/protocol/apps.py:14-36` | AppRunState message |
| `libpebble2/protocol/apps.py:41-65` | AppFetch request/response |
| `libpebble2/protocol/apps.py:68-84` | AppMetadata structure |
| `libpebble2/util/bundle.py:15-67` | PBW ZIP structure, platform paths |
| `libpebble2/util/bundle.py:116-145` | App binary header parsing |
| `pebble_tool/commands/install.py:56-62` | CLI install entry point |
