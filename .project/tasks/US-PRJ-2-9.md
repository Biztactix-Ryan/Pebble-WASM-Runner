---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-2-9
points: 1
status: todo
story_id: US-PRJ-2
tags: []
title: 'TEST: Unit test FEED packet framing (Node.js)'
updated: '2026-04-07'
---

Write Node.js unit tests that import the framing logic and verify: correct magic bytes (0xFEED), correct length encoding, payload bytes match input, byte order is correct. Use known test vectors. No browser or WASM needed.