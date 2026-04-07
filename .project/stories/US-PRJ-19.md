---
acceptance_criteria:
- pebble-qemu-wasm source cloned from ericmigi/pebble-qemu-wasm
- libpebble2 cloned from pebble/libpebble2 as reference
- pebble-tool cloned from pebble/pebble-tool as reference
- build_wasm.sh runs successfully and produces WASM output
- Emulator boots PebbleOS in a browser and shows the watch face
- PebbleOS firmware image is available and loads correctly
- Build dependencies (Emscripten SDK) documented
- Reference repos clearly marked as read-only in project structure
created: '2026-04-07'
depends_on: []
epic_id: EPIC-PRJ-1
id: US-PRJ-19
points: 5
priority: must
status: ready
tags:
- mvp
- foundation
- setup
title: Bootstrap source repositories and verify emulator builds
updated: '2026-04-07'
---

As a developer, I want the pebble-qemu-wasm source code cloned into this project as the working base, and the reference repos (libpebble2, pebble-tool) cloned for protocol research, so that all subsequent work has the codebase available.

This is the true starting point — every other story depends on having these repos available. pebble-qemu-wasm is the code we modify. libpebble2 and pebble-tool are read-only references for porting protocol logic.

CRITICAL DEPENDENCY: US-PRJ-1, US-PRJ-8, US-PRJ-10, and US-PRJ-13 (all research stories) implicitly depend on this story completing first.