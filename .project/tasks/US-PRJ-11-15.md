---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-11-15
points: 1
status: todo
story_id: US-PRJ-11
tags: []
title: 'TEST: DATA message construction with various chunk sizes (Node.js)'
updated: '2026-04-07'
---

Test: full 2000-byte chunk, partial last chunk (e.g., 500 bytes), single-byte chunk. Verify header + payload layout correct in each case.