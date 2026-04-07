---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-2-11
points: 2
status: todo
story_id: US-PRJ-2
tags: []
title: 'TEST: Integration — send packet into WASM QEMU and verify arrival'
updated: '2026-04-07'
---

Build the WASM emulator on Linux. Use a headless browser (Playwright) or Node.js with WASM loader to call sendPebblePacket(). Add temporary logging in pebble_control.c to confirm the packet arrives at the emulated UART with correct data. This proves the full C→WASM→JS path works.