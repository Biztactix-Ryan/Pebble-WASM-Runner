---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-11-17
points: 1
status: todo
story_id: US-PRJ-11
tags: []
title: 'TEST: ACK parsing for all status codes (Node.js)'
updated: '2026-04-07'
---

Construct ACK buffers for: success, NACK, each error code. Verify parser extracts correct cookie and status. Test truncated/malformed ACK buffers.