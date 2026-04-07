---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-2-6
points: 2
status: todo
story_id: US-PRJ-2
tags: []
title: Add C function pebble_control_send_packet() for JS-initiated packet injection
updated: '2026-04-07'
---

In pebble_control.c, add a function that accepts a protocol ID and raw payload buffer, wraps it in correct FEED framing, and writes it to the control UART. This is the C-side entry point the JS bridge will call.