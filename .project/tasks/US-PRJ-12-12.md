---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-12-12
points: 1
status: todo
story_id: US-PRJ-12
tags: []
title: Implement error handling and abort flow
updated: '2026-04-07'
---

On error ACK: send ABORT message, reject the transfer promise with descriptive error including the status code. On timeout: send ABORT, reject. Ensure cleanup of bridge listeners on any exit path.