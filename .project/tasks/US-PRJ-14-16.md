---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-14-16
points: 1
status: todo
story_id: US-PRJ-14
tags: []
title: 'TEST: Unknown/malformed message handling (Node.js)'
updated: '2026-04-07'
---

Feed random bytes, truncated messages, wrong endpoint IDs to each parser. Verify they return null/error gracefully without throwing uncaught exceptions.