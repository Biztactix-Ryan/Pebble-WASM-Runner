---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-12-18
points: 1
status: todo
story_id: US-PRJ-12
tags: []
title: 'TEST: Progress callback fires correctly (Node.js, mock bridge)'
updated: '2026-04-07'
---

Transfer a 10000-byte buffer. Verify onProgress called 5 times with values (2000,10000), (4000,10000), (6000,10000), (8000,10000), (10000,10000).