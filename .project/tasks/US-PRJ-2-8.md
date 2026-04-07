---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-2-8
points: 1
status: todo
story_id: US-PRJ-2
tags: []
title: 'Write JS bridge wrapper: sendPebblePacket()'
updated: '2026-04-07'
---

Create js/pebble-bridge.js with a clean async API: sendPebblePacket(protocolId, payload). Handles heap allocation, the ccall, and cleanup. Returns a promise if ack-based, or void for fire-and-forget.