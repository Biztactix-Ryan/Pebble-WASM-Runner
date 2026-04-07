---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-16-8
points: 2
status: todo
story_id: US-PRJ-16
tags: []
title: Create automated e2e test script
updated: '2026-04-07'
---

Write a script (Node.js + Playwright) that: boots WASM emulator, waits for PebbleOS ready, loads a PBW, runs installer, asserts completion. Parameterized to run with each fixture PBW.