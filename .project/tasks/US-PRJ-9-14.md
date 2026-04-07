---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-9-14
points: 1
status: done
story_id: US-PRJ-9
tags: []
title: 'TEST: UUID encoding roundtrip (Node.js)'
updated: '2026-04-07'
---

Test known UUIDs: verify binary output matches expected bytes. Test edge cases: all-zeros UUID, all-FF UUID, mixed case input. Compare against Python uuid.UUID().bytes output.