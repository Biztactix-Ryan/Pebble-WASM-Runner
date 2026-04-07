---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-15-20
points: 2
status: todo
story_id: US-PRJ-15
tags: []
title: 'TEST: Full install with mock bridge — app only (Node.js)'
updated: '2026-04-07'
---

Mock bridge simulates PebbleOS: sends AppFetch request, responds to metadata with slot assignment, ACKs all PutBytes messages, sends completion. Verify entire sequence executes correctly for a PBW with only an app binary. No browser needed.