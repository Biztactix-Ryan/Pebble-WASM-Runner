# PutBytes Protocol Specification

> Derived from `libpebble2/protocol/transfers.py`, `libpebble2/services/putbytes.py`, and `libpebble2/util/stm32_crc.py`

## Overview

PutBytes is the Pebble Protocol endpoint used to transfer binary data (apps, resources, firmware) to the watch. It operates as a 4-stage request/response protocol over Pebble Protocol endpoint `0xBEEF`.

**Transport**: Pebble Protocol (length-prefixed, big-endian) inside FEED/BEEF SPP frames.

## Pebble Protocol Framing

Each PutBytes message is wrapped in a Pebble Protocol frame before being placed inside a FEED/BEEF SPP packet:

```
Pebble Protocol frame:
+--------+--------+--------+--------+-- ... --+
| Length (uint16 BE)       | Endpoint (uint16 BE)       | Payload |
+--------+--------+--------+--------+-- ... --+

Full wire format (inside FEED/BEEF):
0xFEED + 0x0001(SPP) + total_len + [PP_length + 0xBEEF(endpoint) + PutBytes_payload] + 0xBEEF(footer)
```

Note: The `0xBEEF` endpoint ID is coincidentally the same as the FEED/BEEF footer signature, but they serve different purposes.

## Commands

All multi-byte fields are **big-endian**.

| Command | ID | Direction | Description |
|---------|-----|-----------|-------------|
| INIT | 0x01 | Host → Watch | Begin transfer, receive cookie |
| PUT | 0x02 | Host → Watch | Send data chunk |
| COMMIT | 0x03 | Host → Watch | Finalize with CRC |
| ABORT | 0x04 | Host → Watch | Cancel transfer |
| INSTALL | 0x05 | Host → Watch | Activate installed object |

### Command 0x01: INIT

Two variants exist, distinguished by bit 7 of `object_type`:

**Legacy INIT** (`PutBytesInit` — bit 7 clear):
```
+--------+--------+--------+--------+--------+--------+--------+-- ... --+--------+
| command| object_size (uint32 BE)    | type   | bank   | filename (null-terminated)|
+--------+--------+--------+--------+--------+--------+--------+-- ... --+--------+
```

| Offset | Size | Field | Description |
|--------|------|-------|-------------|
| 0 | 1 | command | `0x01` |
| 1 | 4 | object_size | Total size of object in bytes |
| 5 | 1 | object_type | Object type (1-7, see below) |
| 6 | 1 | bank | Target bank number |
| 7 | var | filename | Null-terminated filename string |

**Modern App INIT** (`PutBytesAppInit` — bit 7 set):
```
+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+
| command| object_size (uint32 BE)    | type   | app_id (uint32 BE)              |
+--------+--------+--------+--------+--------+--------+--------+--------+--------+--------+
```

| Offset | Size | Field | Description |
|--------|------|-------|-------------|
| 0 | 1 | command | `0x01` |
| 1 | 4 | object_size | Total size of object in bytes |
| 5 | 1 | object_type | Object type with bit 7 set (e.g., `0x85` for AppExecutable) |
| 6 | 4 | app_id | Application install ID |

### Command 0x02: PUT

```
+--------+--------+--------+--------+--------+--------+--------+--------+--------+-- ... --+
| command| cookie (uint32 BE)         | payload_size (uint32 BE)   | payload             |
+--------+--------+--------+--------+--------+--------+--------+--------+--------+-- ... --+
```

| Offset | Size | Field | Description |
|--------|------|-------|-------------|
| 0 | 1 | command | `0x02` |
| 1 | 4 | cookie | Cookie from INIT response |
| 5 | 4 | payload_size | Number of payload bytes following |
| 9 | var | payload | Data chunk (max **2000 bytes**) |

### Command 0x03: COMMIT

```
+--------+--------+--------+--------+--------+--------+--------+--------+--------+
| command| cookie (uint32 BE)         | object_crc (uint32 BE)     |
+--------+--------+--------+--------+--------+--------+--------+--------+--------+
```

| Offset | Size | Field | Description |
|--------|------|-------|-------------|
| 0 | 1 | command | `0x03` |
| 1 | 4 | cookie | Cookie from INIT response |
| 5 | 4 | object_crc | STM32 CRC-32 of entire object (see CRC section) |

### Command 0x04: ABORT

```
+--------+--------+--------+--------+--------+
| command| cookie (uint32 BE)         |
+--------+--------+--------+--------+--------+
```

| Offset | Size | Field | Description |
|--------|------|-------|-------------|
| 0 | 1 | command | `0x04` |
| 1 | 4 | cookie | Cookie from INIT response |

### Command 0x05: INSTALL

```
+--------+--------+--------+--------+--------+
| command| cookie (uint32 BE)         |
+--------+--------+--------+--------+--------+
```

| Offset | Size | Field | Description |
|--------|------|-------|-------------|
| 0 | 1 | command | `0x05` |
| 1 | 4 | cookie | Cookie from INIT response |

## Response

All commands receive the same response format:

```
+--------+--------+--------+--------+--------+
| result | cookie (uint32 BE)         |
+--------+--------+--------+--------+--------+
```

| Offset | Size | Field | Values |
|--------|------|-------|--------|
| 0 | 1 | result | `0x01` = ACK, `0x02` = NACK |
| 1 | 4 | cookie | Cookie assigned by firmware |

The cookie from the INIT response must be used in all subsequent PUT/COMMIT/INSTALL/ABORT commands.

## Object Types

| ID | Name | Description |
|----|------|-------------|
| 0x01 | Firmware | Firmware binary |
| 0x02 | Recovery | Recovery firmware |
| 0x03 | SystemResource | System resource pack |
| 0x04 | AppResource | Application resources |
| 0x05 | AppExecutable | Application binary |
| 0x06 | File | Generic file |
| 0x07 | Worker | Background worker binary |

For modern app installs (3.x+), bit 7 is set on the object type (e.g., AppExecutable becomes `0x85`), and `PutBytesAppInit` is used instead of `PutBytesInit`.

## Transfer Flow

```
Host                              Watch
  |                                 |
  |-- INIT (size, type, app_id) --> |
  |<-- Response (ACK, cookie) ----- |
  |                                 |
  |-- PUT (cookie, chunk 1) ------> |
  |<-- Response (ACK, cookie) ----- |
  |-- PUT (cookie, chunk 2) ------> |
  |<-- Response (ACK, cookie) ----- |
  |   ... repeat until all sent ... |
  |                                 |
  |-- COMMIT (cookie, crc) -------> |
  |<-- Response (ACK, cookie) ----- |
  |                                 |
  |-- INSTALL (cookie) -----------> |
  |<-- Response (ACK, cookie) ----- |
```

Each command is synchronous — wait for ACK before sending the next.

## STM32 CRC-32

**WARNING**: This is NOT standard CRC-32. Using a standard CRC32 implementation will produce incorrect results.

| Parameter | Value |
|-----------|-------|
| Polynomial | `0x04C11DB7` |
| Initial value | `0xFFFFFFFF` |
| Reflection | **None** (MSB-first) |
| Final XOR | None |
| Processing | 4-byte words, big-endian |

### Algorithm

```
function stm32_crc32(data):
    crc = 0xFFFFFFFF
    for each 4-byte word in data (pad last word with leading zeros if < 4 bytes):
        crc = crc XOR word
        for i = 0 to 31:
            if (crc & 0x80000000):
                crc = (crc << 1) XOR 0x04C11DB7
            else:
                crc = crc << 1
            crc = crc & 0xFFFFFFFF
    return crc
```

Key differences from standard CRC32:
- No input/output bit reflection
- Processes data in 4-byte words (not byte-by-byte)
- Final incomplete word is zero-padded at the start (leading zeros)

## Source References

| File | Key Content |
|------|-------------|
| `libpebble2/protocol/transfers.py:15-23` | ObjectType enum |
| `libpebble2/protocol/transfers.py:25-69` | Message class definitions |
| `libpebble2/protocol/transfers.py:89-98` | Response format (ACK/NACK) |
| `libpebble2/services/putbytes.py:14-21` | PutBytesType enum |
| `libpebble2/services/putbytes.py:53-105` | 4-stage transfer flow |
| `libpebble2/util/stm32_crc.py:7-43` | STM32 CRC-32 implementation |
