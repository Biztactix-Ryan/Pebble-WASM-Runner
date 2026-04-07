---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-3-7
points: 1
status: todo
story_id: US-PRJ-3
tags: []
title: Export callback registration function via Emscripten
updated: '2026-04-07'
---

Add a C function like pebble_control_register_callback() to EXPORTED_FUNCTIONS. JS will call this to provide a function pointer (or use EM_JS) that gets invoked when packets arrive.