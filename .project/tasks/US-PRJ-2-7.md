---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-2-7
points: 1
status: todo
story_id: US-PRJ-2
tags: []
title: Add Emscripten export for packet send function
updated: '2026-04-07'
---

Add the new C function to EXPORTED_FUNCTIONS in build_wasm.sh. Create the ccall/cwrap JS wrapper that accepts a protocol ID (uint16) and a Uint8Array payload, copies data into WASM heap, and calls the C function.