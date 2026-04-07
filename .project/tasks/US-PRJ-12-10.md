---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-12-10
points: 1
status: done
story_id: US-PRJ-12
tags: []
title: Implement chunking logic
updated: '2026-04-07'
---

Split input ArrayBuffer into chunks of configurable size (default 2000 bytes). Handle: last chunk smaller than chunk size, buffer exactly divisible by chunk size, buffer smaller than one chunk.