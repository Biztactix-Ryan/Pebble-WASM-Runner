---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-5-7
points: 1
status: todo
story_id: US-PRJ-5
tags: []
title: 'TEST: Unit test file reading with mock File objects (Node.js)'
updated: '2026-04-07'
---

Create Node.js tests using fs.readFileSync to load test PBW fixtures as Buffers. Verify loadPbwFile returns correct ArrayBuffer with matching byte length. Test with real .pbw fixture files committed to the test directory.