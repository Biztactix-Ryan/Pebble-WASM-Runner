---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-16-12
points: 1
status: todo
story_id: US-PRJ-16
tags: []
title: 'TEST: E2E error handling — corrupt PBW'
updated: '2026-04-07'
---

Attempt to install a deliberately corrupted PBW (truncated binary). Verify: error is caught and reported, emulator is not left in a broken state, can install a good PBW afterward.