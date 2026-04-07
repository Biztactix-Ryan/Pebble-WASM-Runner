---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-11-18
points: 2
status: todo
story_id: US-PRJ-11
tags: []
title: 'TEST: Byte-comparison of all message types against libpebble2 reference (Node.js)'
updated: '2026-04-07'
---

For each test vector from US-PRJ-10, build the same message in JS and compare byte-for-byte. This is the gold standard. Any mismatch = protocol bug that would cause install failure.