---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-9-10
points: 1
status: todo
story_id: US-PRJ-9
tags: []
title: Implement fixed-length string encoder
updated: '2026-04-07'
---

Encode app name and company name as fixed-length byte arrays (null-padded or truncated). Determine the max length from the protocol spec (likely 96 bytes for app name, 64 for company). Handle UTF-8 correctly.