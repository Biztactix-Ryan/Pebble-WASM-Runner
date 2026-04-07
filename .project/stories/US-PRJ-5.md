---
acceptance_criteria:
- File input accepts .pbw files
- File is read as ArrayBuffer using FileReader API
- Handles missing or invalid file gracefully
- Works in all modern browsers
created: '2026-04-07'
depends_on: []
epic_id: EPIC-PRJ-2
id: US-PRJ-5
points: 2
priority: must
status: ready
tags:
- mvp
title: Load PBW file via browser File API
updated: '2026-04-07'
---

As a user, I want to select a .pbw file from my computer so that the browser can read it for parsing and installation.