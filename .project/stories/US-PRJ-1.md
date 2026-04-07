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
status: ready
tags:
- research
- mvp
title: Understand FEED/BEEF control protocol internals
updated: '2026-04-07'
---

As a developer, I want to fully understand how the FEED/BEEF control protocol works in pebble_control.c so that I can extend it for JS-callable packet injection.

Key files to read in pebble-qemu-wasm (branch: main):
- hw/arm/pebble_control.c — FEED/BEEF framing, 8 protocol types (SPP is type 0), packet forwarding to UART
- hw/arm/pebble_control.h — control API: pebble_control_create(), pebble_control_send_vibe_notification()
- hw/arm/pebble.c — UART creation, board configs (snowy/emery/s4), button input, STM32F439 init
- build_wasm.sh — Docker-based build, Emscripten toolchain (exports NOT listed here)
- scripts/patch_wasm.py — Emscripten flags, optimization, asyncify, TLB acceleration
- web/index.html — existing JS API: display framebuffer, button state via Atomics, FS for firmware

CRITICAL: Pebble protocol data travels via SPP (protocol type 0) within FEED/BEEF frames. The packet format is:
0xFEED (2B) + Protocol ID (2B) + Data Length (2B) + Payload + 0xBEEF (2B)

PREREQUISITE: US-PRJ-19 (Bootstrap source repositories) must complete first.