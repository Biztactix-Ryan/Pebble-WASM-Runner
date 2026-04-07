---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-6-9
points: 2
status: done
story_id: US-PRJ-6
tags: []
title: Implement PBW zip extraction logic
updated: '2026-04-07'
---

Create extractPbw(arrayBuffer) function. Use JSZip to open the buffer, then extract: appinfo.json (as text → JSON parse), pebble-app.bin (as ArrayBuffer), app_resources.pbpack (as ArrayBuffer, optional), worker.bin (as ArrayBuffer, optional). Return structured result.