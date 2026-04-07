---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-1-7
points: 1
status: done
story_id: US-PRJ-1
tags: []
title: Map current Emscripten export surface
updated: '2026-04-07'
---

Read build_wasm.sh and scripts/patch_wasm.py. Document which C functions are currently exported to JS, what JS glue exists, and how the WASM module is instantiated in index.html. Identify the insertion points for new exports.