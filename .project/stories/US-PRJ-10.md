---
acceptance_criteria:
- PutBytes INIT message format documented (fields sizes byte order)
- DATA message format and max chunk size documented
- COMMIT message format and CRC algorithm identified
- ACK response format and status codes documented
- Object type codes listed (app binary resources worker file)
- Cookie/token handling understood
created: '2026-04-07'
depends_on: []
epic_id: EPIC-PRJ-4
id: US-PRJ-10
points: 3
priority: must
status: ready
tags:
- research
- mvp
title: Research PutBytes protocol from libpebble2
updated: '2026-04-07'
---

As a developer, I want to fully understand the PutBytes protocol by studying libpebble2 so that I can accurately port it to JavaScript.

Key files to read in libpebble2:
- libpebble2/protocol/transfers.py — PutBytes message definitions, object types, GetBytes
- libpebble2/services/putbytes.py — PutBytes state machine, chunking (2000 bytes), 4-stage flow
- libpebble2/util/stm32_crc.py — STM32 CRC-32 (NOT standard CRC32!)

Endpoint: 0xBEEF

Five commands (not four):
- 0x01 INIT: PutBytesInit (legacy, bank-based) OR PutBytesAppInit (modern, app_id-based)
- 0x02 PUT: cookie + payload_size + payload (max 2000 bytes)
- 0x03 COMMIT: cookie + object_crc (STM32 CRC-32)
- 0x04 ABORT: cookie
- 0x05 INSTALL: cookie

Object types: Firmware=1, Recovery=2, SystemResource=3, AppResource=4, AppExecutable=5, File=6, Worker=7

Response: result (ACK=0x01, NACK=0x02) + cookie (Uint32)

CRC WARNING: STM32 CRC-32 uses polynomial 0x04C11DB7 with init 0xFFFFFFFF but NO reflection (MSB-first, 4-byte word processing). Standard CRC32 WILL NOT WORK.

PREREQUISITE: US-PRJ-19 (Bootstrap source repositories) must complete first.