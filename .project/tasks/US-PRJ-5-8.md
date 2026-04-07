---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-5-8
points: 1
status: done
story_id: US-PRJ-5
tags: []
title: 'TEST: Unit test rejection of non-PBW files (Node.js)'
updated: '2026-04-07'
---

Test: plain text file rejected, PNG image rejected, empty file rejected, truncated zip rejected. Each should produce a descriptive error, not a generic crash.