---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-14-8
points: 1
status: done
story_id: US-PRJ-14
tags: []
title: 'Implement generic Pebble protocol framing: buildPacket() and parsePacket()'
updated: '2026-04-07'
---

Pebble protocol packets have a header: length (uint16 big-endian) + endpoint ID (uint16 big-endian) + payload. Implement buildPacket(endpointId, payload) and parsePacket(buffer) that handle this framing. All other message builders/parsers work with the inner payload.