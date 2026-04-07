---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-12-13
points: 1
status: todo
story_id: US-PRJ-12
tags: []
title: Implement progress callback
updated: '2026-04-07'
---

Accept an optional onProgress(bytesSent, totalBytes) callback. Fire it after each successful DATA ack. Calculate correct running total.