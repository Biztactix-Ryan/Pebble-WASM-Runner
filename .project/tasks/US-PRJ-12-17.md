---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-12-17
points: 1
status: done
story_id: US-PRJ-12
tags: []
title: 'TEST: Timeout triggers abort (Node.js, mock bridge)'
updated: '2026-04-07'
---

Mock bridge never responds to INIT. Verify: timeout fires, ABORT sent, promise rejects with timeout error. Test with short timeout (100ms) to keep test fast.