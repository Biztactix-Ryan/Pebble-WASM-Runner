---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-9-9
points: 1
status: todo
story_id: US-PRJ-9
tags: []
title: Implement UUID string-to-binary encoder
updated: '2026-04-07'
---

Convert a UUID string (e.g., '4dff3d96-6f74-11e4-9803-0800200c9a66') into a 16-byte Uint8Array. Handle with/without dashes. Must match the byte order PebbleOS expects (big-endian UUID encoding).