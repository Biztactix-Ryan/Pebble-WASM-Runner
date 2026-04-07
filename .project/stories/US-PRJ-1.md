---
acceptance_criteria:
- FEED/BEEF packet format documented
- UART creation path in pebble.c understood
- Control protocol handler flow in pebble_control.c mapped
- Current Emscripten export surface identified
created: '2026-04-07'
depends_on: []
epic_id: EPIC-PRJ-1
id: US-PRJ-1
points: 3
priority: must
status: backlog
tags:
- research
- mvp
title: Understand FEED/BEEF control protocol internals
updated: '2026-04-07'
---

As a developer, I want to fully understand how the FEED/BEEF control protocol works in pebble_control.c so that I can extend it for JS-callable packet injection.

Requires reading and documenting: packet framing format, UART device setup in pebble.c, how pebble_control.c handles incoming/outgoing data, and how Emscripten currently exposes (or doesn't expose) these interfaces.