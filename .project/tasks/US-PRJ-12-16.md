---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-12-16
points: 1
status: todo
story_id: US-PRJ-12
tags: []
title: 'TEST: Error ACK triggers abort (Node.js, mock bridge)'
updated: '2026-04-07'
---

Mock bridge returns error ACK on the 3rd DATA chunk. Verify: ABORT message sent, promise rejects with correct error, no more DATA chunks sent after error.