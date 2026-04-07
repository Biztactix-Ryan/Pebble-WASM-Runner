---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-7-7
points: 1
status: done
story_id: US-PRJ-7
tags: []
title: Implement UUID validation
updated: '2026-04-07'
---

Validate UUID format: must be a valid UUID v4 string (8-4-4-4-12 hex). Reject malformed UUIDs with a clear error rather than passing garbage to the installer.