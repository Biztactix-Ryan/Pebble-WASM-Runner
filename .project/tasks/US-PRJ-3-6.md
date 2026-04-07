---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-3-6
points: 2
status: todo
story_id: US-PRJ-3
tags: []
title: Add C-side callback hook for outgoing BEEF packets
updated: '2026-04-07'
---

In pebble_control.c, add a mechanism to call a JS function when a BEEF packet is received from the emulated Pebble. Use Emscripten's EM_ASM or function pointer callback pattern to bridge C→JS.