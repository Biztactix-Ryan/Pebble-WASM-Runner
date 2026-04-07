---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-11-16
points: 1
status: todo
story_id: US-PRJ-11
tags: []
title: 'TEST: CRC32 against known test vectors (Node.js)'
updated: '2026-04-07'
---

Test CRC32 against standard reference values: CRC32('123456789') = 0xCBF43926, empty input, all-zeros, all-FF, large buffer. Also test against the CRC values in the PutBytes test vectors.