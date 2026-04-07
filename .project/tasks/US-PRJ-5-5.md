---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-5-5
points: 1
status: todo
story_id: US-PRJ-5
tags: []
title: Create pbw-loader.js module with File API reader
updated: '2026-04-07'
---

Create js/pbw-loader.js. Implement loadPbwFile(file) that takes a File object from an <input> element, reads it as ArrayBuffer using FileReader (or file.arrayBuffer()), and returns the raw buffer.