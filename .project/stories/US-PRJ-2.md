---
acceptance_criteria:
- JS function accepts protocol ID and ArrayBuffer payload
- Function wraps payload in correct FEED packet framing
- Packet is delivered to the emulated Pebble UART
- Function is exported via Emscripten EXPORTED_FUNCTIONS
- Works from browser console for manual testing
created: '2026-04-07'
depends_on:
- US-PRJ-1
epic_id: EPIC-PRJ-1
id: US-PRJ-2
points: 5
priority: must
status: backlog
tags:
- mvp
title: Expose JS-callable function to send packets into emulator
updated: '2026-04-07'
---

As a developer, I want a JS-callable function (e.g. sendPebblePacket(protocolId, payload)) that injects a Pebble protocol packet into the WASM emulator via the FEED/BEEF control channel so that the browser-side installer can communicate with PebbleOS.