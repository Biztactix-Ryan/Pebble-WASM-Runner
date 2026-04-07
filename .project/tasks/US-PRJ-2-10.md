---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-2-10
points: 1
status: todo
story_id: US-PRJ-2
tags: []
title: 'TEST: Unit test edge cases — empty, max-size, boundary payloads (Node.js)'
updated: '2026-04-07'
---

Test: empty payload (0 bytes), single byte, exactly chunk-boundary size, maximum allowed size, and payload with all 0xFF bytes. Verify framing is correct in each case.