---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-12-19
points: 2
status: todo
story_id: US-PRJ-12
tags: []
title: 'TEST: Integration — PutBytes transfer to WASM emulator (Linux headless)'
updated: '2026-04-07'
---

Build WASM, boot emulator in Playwright, run a PutBytes transfer of a small binary. Verify INIT ack received, all DATA acks received, COMMIT ack received. This proves the engine works against real PebbleOS, not just mocks.