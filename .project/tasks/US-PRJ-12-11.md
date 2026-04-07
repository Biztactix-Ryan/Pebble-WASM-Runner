---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-12-11
points: 1
status: done
story_id: US-PRJ-12
tags: []
title: Implement ack waiting with timeout
updated: '2026-04-07'
---

After each send (INIT, each DATA, COMMIT), wait for the corresponding ACK from the bridge callback. Implement a configurable timeout (e.g., 10 seconds). On timeout, abort and reject.