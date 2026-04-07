---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-12-15
points: 2
status: done
story_id: US-PRJ-12
tags: []
title: 'TEST: Full transfer sequence with mock bridge (Node.js)'
updated: '2026-04-07'
---

Create a mock bridge that records sent messages and responds with appropriate ACKs. Run a full transfer of a known binary. Verify: correct INIT sent, correct number of DATA chunks, correct COMMIT with CRC, correct order. All testable on Linux in Node.js.