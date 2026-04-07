---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-6-13
points: 1
status: todo
story_id: US-PRJ-6
tags: []
title: 'TEST: Unit test corrupt/invalid zip handling (Node.js)'
updated: '2026-04-07'
---

Feed extractPbw() these inputs: random bytes (not a zip), a valid zip but no appinfo.json, a valid zip but no pebble-app.bin, a truncated zip. Verify each produces the correct specific error message, not a generic JSZip stack trace.