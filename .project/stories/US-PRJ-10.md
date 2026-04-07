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

As a developer, I want to fully understand the PutBytes protocol by studying libpebble2/services/putbytes.py so that I can accurately port it to JavaScript.

Need to document: message format for INIT/DATA/COMMIT/ABORT/INSTALL, object type codes, chunk size limits, CRC algorithm, ack response format, error codes, and cookie/token handling.