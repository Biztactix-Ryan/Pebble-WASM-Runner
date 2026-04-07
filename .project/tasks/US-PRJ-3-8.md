---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-3-8
points: 1
status: todo
story_id: US-PRJ-3
tags: []
title: Write JS packet dispatcher in pebble-bridge.js
updated: '2026-04-07'
---

Extend pebble-bridge.js with: onPebblePacket(protocolId, callback) for registering handlers by protocol ID, a default handler for unregistered IDs, and removeHandler(protocolId). The C callback routes through this dispatcher.