---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-6-11
points: 1
status: todo
story_id: US-PRJ-6
tags: []
title: 'TEST: Unit test extraction from known-good PBW fixtures (Node.js)'
updated: '2026-04-07'
---

Commit 2-3 real .pbw files as test fixtures. In Node.js tests, load each, run extractPbw(), verify: appinfo.json parses correctly, binary file sizes match expected, all expected files present. This runs entirely on Linux, no browser.