---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-10-12
points: 1
status: done
story_id: US-PRJ-10
tags: []
title: Create PutBytes test vectors from libpebble2
updated: '2026-04-07'
---

Use the Python code to generate known-good INIT, DATA, COMMIT, and ACK messages for a sample binary. Save as hex fixtures. Include edge cases: single-chunk transfer, multi-chunk, exact-boundary.