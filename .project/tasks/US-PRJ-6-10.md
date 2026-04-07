---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-6-10
points: 1
status: done
story_id: US-PRJ-6
tags: []
title: Add error handling for malformed PBW bundles
updated: '2026-04-07'
---

Handle: corrupt zip (JSZip throws), missing appinfo.json (required), missing pebble-app.bin (required), unexpected directory structure. Each case should produce a specific, actionable error message.