---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-3-9
points: 1
status: todo
story_id: US-PRJ-3
tags: []
title: 'TEST: Unit test dispatcher routing (Node.js)'
updated: '2026-04-07'
---

Test the JS dispatcher in isolation (no WASM): register handlers for multiple protocol IDs, dispatch mock packets, verify correct handler called with correct payload. Test: unregistered ID goes to default, handler removal works, multiple handlers for same ID.