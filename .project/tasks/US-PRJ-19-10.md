---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-19-10
points: 1
status: done
story_id: US-PRJ-19
tags: []
title: Clone libpebble2 as read-only reference
updated: '2026-04-07'
---

Clone https://github.com/pebble/libpebble2 into a reference/ directory (or similar). Mark as read-only — we read this code for protocol understanding, we never modify it. Add to .gitignore or use git submodule.