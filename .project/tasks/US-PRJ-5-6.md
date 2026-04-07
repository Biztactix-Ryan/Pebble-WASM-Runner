---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-5-6
points: 1
status: done
story_id: US-PRJ-5
tags: []
title: 'Add file validation: zip magic byte check'
updated: '2026-04-07'
---

Before passing to JSZip, check the first 4 bytes for the ZIP magic number (PK\x03\x04). Reject non-zip files early with a clear error message.