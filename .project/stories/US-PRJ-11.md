---
acceptance_criteria:
- buildPutBytesAppInit() constructs correct modern INIT with object type size and
  app_id
- buildPutBytesPut() constructs correct DATA message with cookie and chunk payload
- buildPutBytesCommit() constructs correct COMMIT message with STM32 CRC-32
- buildPutBytesAbort() constructs ABORT message
- buildPutBytesInstall() constructs INSTALL message (5th command)
- All messages use little-endian byte order
- STM32 CRC-32 implemented correctly (polynomial 0x04C11DB7 no reflection MSB-first
  4-byte words)
- parsePutBytesResponse() extracts result (ACK=0x01 NACK=0x02) and cookie
created: '2026-04-07'
depends_on:
- US-PRJ-10
epic_id: EPIC-PRJ-4
id: US-PRJ-11
points: 5
priority: must
status: backlog
tags:
- mvp
title: Implement PutBytes message construction in JS
updated: '2026-04-07'
---

As a developer, I want JS functions that construct properly formatted PutBytes INIT, DATA, COMMIT, and ABORT messages as ArrayBuffers so that they can be sent through the emulator bridge.