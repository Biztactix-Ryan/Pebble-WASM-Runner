---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-11-7
points: 1
status: todo
story_id: US-PRJ-11
tags: []
title: Define PutBytes protocol constants
updated: '2026-04-07'
---

Create js/putbytes-protocol.js with all constants: command bytes (INIT=0x01, PUT=0x02, COMMIT=0x03, ABORT=0x04, INSTALL=0x05), object types enum, ACK status codes, default chunk size (2000). Reference values from libpebble2.