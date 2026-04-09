---
acceptance_criteria:
- JS can register a callback function for incoming packets
- Callback receives parsed protocol ID and payload data
- BEEF packets from the emulator are routed to the callback
- Multiple callbacks or a dispatcher pattern is supported
- Works from browser console for manual testing
created: '2026-04-07'
depends_on:
- US-PRJ-1
epic_id: EPIC-PRJ-1
id: US-PRJ-3
points: 5
priority: must
status: backlog
tags:
- mvp
title: Expose JS callback for receiving packets from emulator
updated: '2026-04-09'
---

As a developer, I want to register a JS callback that receives Pebble protocol packets coming out of the emulator (BEEF responses) so that the installer can handle acks, progress, errors, and completion signals.