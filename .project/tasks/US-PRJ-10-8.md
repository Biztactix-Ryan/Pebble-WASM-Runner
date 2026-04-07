---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-10-8
points: 1
status: todo
story_id: US-PRJ-10
tags: []
title: Document PutBytes INIT message format
updated: '2026-04-07'
---

Byte-level layout: command byte, object size (uint32), object type (uint8), bank/index (uint8). Document byte order, total message size. Include all object type enum values: FIRMWARE, RECOVERY, SYS_RESOURCES, RESOURCES, BINARY, FILE, WORKER.