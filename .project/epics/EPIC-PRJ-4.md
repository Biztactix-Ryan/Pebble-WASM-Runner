---
created: '2026-04-07'
id: EPIC-PRJ-4
points: null
priority: must
status: draft
tags:
- mvp
target_date: null
title: PutBytes Protocol Engine
updated: '2026-04-07'
---

Port the PutBytes chunked binary transfer protocol from libpebble2/services/putbytes.py to JavaScript. This is the core transport for sending app binaries, resources, and worker binaries to PebbleOS. Implements the INIT → DATA (chunked) → COMMIT flow with proper ack handling.

Success criteria:
- PutBytes INIT message correctly declares transfer type, size, and target slot
- Binary data is chunked (typically 2000-byte chunks) and sent as DATA messages
- COMMIT message finalizes transfer with CRC
- ACK responses are received and validated at each step
- Handles all object types: app binary, resources, worker, file
- Error responses are detected and surfaced
- Progress can be tracked (bytes sent / total)

Scope: Message construction, chunking, CRC calculation, ack handling. Reference: libpebble2/services/putbytes.py