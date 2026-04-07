---
created: '2026-04-07'
id: EPIC-PRJ-1
points: null
priority: must
status: draft
tags:
- mvp
- foundation
target_date: null
title: Emulator Packet Bridge
updated: '2026-04-07'
---

Extend pebble-qemu-wasm with a browser-callable control bridge. Expose JS functions to send raw FEED/BEEF protocol packets into the WASM QEMU emulator and receive response packets back. This is the foundation — every other component depends on being able to send/receive Pebble protocol messages.

Success criteria:
- JS can call a function to send an arbitrary Pebble protocol packet into the emulator
- JS can register a callback to receive packets from the emulator
- Packets flow correctly through the FEED/BEEF UART control channel
- Works with the Emscripten WASM build

Scope: pebble_control.c extensions, Emscripten JS exports, JS bridge wrapper API