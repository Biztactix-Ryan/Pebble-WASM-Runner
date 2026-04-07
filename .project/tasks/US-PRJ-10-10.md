---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-10-10
points: 1
status: done
story_id: US-PRJ-10
tags: []
title: Document PutBytes COMMIT and ABORT message formats
updated: '2026-04-07'
---

COMMIT: command byte, cookie (uint32), CRC (uint32). ABORT: command byte, cookie (uint32). Document the CRC algorithm used (likely CRC32).