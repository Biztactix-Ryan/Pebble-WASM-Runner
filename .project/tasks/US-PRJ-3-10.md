---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-3-10
points: 1
status: todo
story_id: US-PRJ-3
tags: []
title: 'TEST: Unit test BEEF packet parsing (Node.js)'
updated: '2026-04-07'
---

Given raw BEEF-framed byte arrays (from test vectors), verify the parser correctly extracts: protocol ID, payload length, payload bytes. Test malformed packets: truncated, wrong magic, zero length.