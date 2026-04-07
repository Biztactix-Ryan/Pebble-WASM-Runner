---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-12-9
points: 2
status: todo
story_id: US-PRJ-12
tags: []
title: Implement PutBytes transfer engine class
updated: '2026-04-07'
---

Create js/putbytes-engine.js with class PutBytesTransfer. Constructor takes: bridge (for send/receive), data (ArrayBuffer), objectType, bankIndex. Exposes async start() that runs the full INIT→DATA→COMMIT flow.