# FEED/BEEF Control Protocol Specification

> Derived from `pebble-qemu-wasm/hw/arm/pebble_control.c` and `pebble_control.h`

## Overview

The FEED/BEEF protocol is a framing layer used for communication between a host (e.g., pebble-tool) and the Pebble QEMU emulator over a TCP serial channel. It multiplexes Pebble Protocol (SPP) data alongside control messages for buttons, sensors, and vibration.

**Transport**: TCP socket (typically port 12344), connected to USART2 via PebbleControl middleware.

## Packet Format

All multi-byte fields are **big-endian** (network byte order).

```
+--------+--------+--------+--------+--------+--------+-- ... --+--------+--------+
| 0xFE   | 0xED   | Proto  | Proto  | Length | Length | Payload | 0xBE   | 0xEF   |
| (high) | (low)  | (high) | (low)  | (high) | (low)  |         | (high) | (low)  |
+--------+--------+--------+--------+--------+--------+-- ... --+--------+--------+
  Header (6 bytes)                                                Footer (2 bytes)
```

| Offset | Size | Field | Description |
|--------|------|-------|-------------|
| 0 | 2 | Signature | `0xFEED` — header magic |
| 2 | 2 | Protocol | Protocol type ID (1-8) |
| 4 | 2 | Length | Payload length in bytes (0-2048) |
| 6 | 0-2048 | Payload | Protocol-specific data |
| 6+len | 2 | Footer | `0xBEEF` — footer magic |

**Maximum packet size**: 6 + 2048 + 2 = **2056 bytes**

## Protocol Types

| ID | Name | Direction | Payload Size | Description |
|----|------|-----------|-------------|-------------|
| 1 | SPP | Bidirectional | Variable | Raw Pebble Protocol data (passthrough to UART) |
| 2 | Tap | Host → Emu | 2 bytes | Accelerometer tap event |
| 3 | BluetoothConnection | Host → Emu | 1 byte | Bluetooth connection state |
| 4 | Compass | Host → Emu | 5 bytes | Compass heading update |
| 5 | Battery | Host → Emu | 2 bytes | Battery status update |
| 6 | Accel | Bidirectional | Variable | Accelerometer samples |
| 7 | Vibration | Emu → Host | 1 byte | Vibration motor state |
| 8 | Button | Host → Emu | 1 byte | Button press/release state |

### Implementation Status

| Protocol | Handler Registered | Notes |
|----------|-------------------|-------|
| SPP (1) | No (passthrough) | Entire FEED/BEEF frame forwarded to UART as-is |
| Tap (2) | No | Struct defined, no callback |
| Bluetooth (3) | No | Struct defined, no callback |
| Compass (4) | No | Struct defined, no callback |
| Battery (5) | No | Struct defined, no callback |
| Accel (6) | No | Structs defined for request + response, no callback |
| Vibration (7) | N/A | Emu→Host only, sent via `pebble_control_send_vibe_notification()` |
| Button (8) | **Yes** | `pebble_control_button_msg_callback()` → `pebble_set_button_state()` |

## Payload Formats

### Protocol 1: SPP (Pebble Protocol)

Variable-length. The payload contains raw Pebble Protocol data. The entire FEED/BEEF frame (header + payload + footer) is forwarded to the UART without stripping the framing — the firmware sees and parses the FEED/BEEF envelope.

### Protocol 2: Tap

```
+--------+--------+
| axis   | dir    |
+--------+--------+
```

| Offset | Size | Field | Values |
|--------|------|-------|--------|
| 0 | 1 | axis | 0=X, 1=Y, 2=Z |
| 1 | 1 | direction | +1 or -1 (signed) |

### Protocol 3: Bluetooth Connection

```
+--------+
| conn   |
+--------+
```

| Offset | Size | Field | Values |
|--------|------|-------|--------|
| 0 | 1 | connected | 0=disconnected, non-zero=connected |

### Protocol 4: Compass

```
+--------+--------+--------+--------+--------+
| heading (uint32, big-endian)       | calib  |
+--------+--------+--------+--------+--------+
```

| Offset | Size | Field | Values |
|--------|------|-------|--------|
| 0 | 4 | magnetic_heading | 0x10000 = 360 degrees (big-endian) |
| 4 | 1 | calib_status | CompassStatus enum |

### Protocol 5: Battery

```
+--------+--------+
| pct    | plug   |
+--------+--------+
```

| Offset | Size | Field | Values |
|--------|------|-------|--------|
| 0 | 1 | battery_pct | 0-100 |
| 1 | 1 | charger_connected | 0=unplugged, non-zero=plugged |

### Protocol 6: Accel

**Host → Emu (samples)**:
```
+--------+--------+--------+--------+--------+--------+--------+-- ... --+
| count  | x0 (int16 BE)   | y0 (int16 BE)   | z0 (int16 BE)   | ...    |
+--------+--------+--------+--------+--------+--------+--------+-- ... --+
```

| Offset | Size | Field | Values |
|--------|------|-------|--------|
| 0 | 1 | num_samples | Number of 6-byte samples following |
| 1 | 6*N | samples[] | Each: int16 x, int16 y, int16 z (big-endian) |

**Emu → Host (response)**:
```
+--------+--------+
| space (uint16 BE)|
+--------+--------+
```

| Offset | Size | Field | Values |
|--------|------|-------|--------|
| 0 | 2 | avail_space | Number of samples emu can accept (big-endian) |

### Protocol 7: Vibration

```
+--------+
| on     |
+--------+
```

| Offset | Size | Field | Values |
|--------|------|-------|--------|
| 0 | 1 | on | 0=off, non-zero=on |

Sent by `pebble_control_send_vibe_notification()` when firmware toggles the vibration motor.

### Protocol 8: Button

```
+--------+
| state  |
+--------+
```

| Offset | Size | Field | Values |
|--------|------|-------|--------|
| 0 | 1 | button_state | Bitmask of button states |

Button bit encoding:
| Bit | Button |
|-----|--------|
| 0 | Back |
| 1 | Up |
| 2 | Select |
| 3 | Down |

Bit set = button pressed, bit clear = button released.

## Data Flow

### Host → Emulator (Ingress)

```
Host TCP:12344
  → CharBackend
  → pebble_control_receive() — buffer in rcv_char_buf (2056 bytes)
  → pebble_control_parse_receive_buffer()
    → If handler exists (Button): call handler, consume packet
    → If no handler (SPP, etc.): forward entire FEED/BEEF frame to UART
      → pebble_control_forward_to_target()
        → UART backpressure: 1ms timer retry if buffer full
```

### Emulator → Host (Egress)

```
Firmware writes to USART2 DR register
  → stm32_uart_write() triggers chr_write handler
  → pebble_control_write() — buffer in send_char_buf (2056 bytes)
    → Accumulates bytes until complete FEED/BEEF packet detected
    → Sends complete packet to host via qemu_chr_fe_write_all()
```

### Vibration Notification (Emu → Host, out-of-band)

```
GPIO-F pin 4 change
  → PebbleBoard vibe_ctl callback
  → pebble_control_send_vibe_notification()
  → pebble_control_send_packet() — constructs FEED/BEEF frame
  → qemu_chr_fe_write_all() — directly to host socket
```

## Error Recovery

- **Invalid header**: If bytes don't start with 0xFEED, consume 2 bytes and rescan
- **Oversized length**: If length > 2048, consume 6 bytes (header) and rescan
- **Incomplete packet**: Wait for more data (timer-driven retry)
- **Send buffer overflow**: Discard pending data, reset buffer
- **TCP write failure**: Discard packet, continue processing

## Constants

| Name | Value | Description |
|------|-------|-------------|
| QEMU_HEADER_SIGNATURE | 0xFEED | Packet header magic |
| QEMU_FOOTER_SIGNATURE | 0xBEEF | Packet footer magic |
| QEMU_MAX_DATA_LEN | 2048 | Maximum payload bytes |
| PBLCONTROL_BUF_LEN | 2056 | Receive/send buffer size (header + max payload + footer) |

## Source References

| File | Key Content |
|------|-------------|
| `hw/arm/pebble_control.c:59-68` | Header/footer struct definitions |
| `hw/arm/pebble_control.c:72-81` | QemuProtocol enum |
| `hw/arm/pebble_control.c:88-144` | Protocol payload structs |
| `hw/arm/pebble_control.c:153-192` | PebbleControl state struct |
| `hw/arm/pebble_control.c:289-344` | Packet parser |
| `hw/arm/pebble_control.c:401-471` | UART→host write handler |
| `hw/arm/pebble_control.c:476-508` | Packet constructor + vibe notification |
| `hw/arm/pebble_control.c:511-542` | PebbleControl creation/init |
