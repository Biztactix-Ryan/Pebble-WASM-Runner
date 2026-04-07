---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-12-14
points: 1
status: todo
story_id: US-PRJ-12
tags: []
title: 'TEST: Chunking logic in isolation (Node.js)'
updated: '2026-04-07'
---

Unit test the chunking function alone: 10000-byte buffer at 2000-byte chunks = 5 chunks. 10001 bytes = 6 chunks (last is 1 byte). 1 byte = 1 chunk. 0 bytes = rejected. 2000 bytes exactly = 1 chunk.