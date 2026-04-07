---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-1-5
points: 1
status: todo
story_id: US-PRJ-1
tags: []
title: Read and annotate pebble_control.c FEED/BEEF packet handler
updated: '2026-04-07'
---

Read hw/arm/pebble_control.c thoroughly. Document how FEED (host→emu) and BEEF (emu→host) packets are framed: magic bytes, length fields, payload structure, byte order. Annotate the key functions.