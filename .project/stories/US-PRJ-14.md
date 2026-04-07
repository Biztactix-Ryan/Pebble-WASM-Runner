---
acceptance_criteria:
- 'Parse AppFetchRequest from emulator (endpoint 0x1771): command uuid app_id'
- Build AppFetchResponse with status code (Start=0 Busy=1 InvalidUUID=2 NoData=3)
- 'Parse and build AppRunState messages (endpoint 0x34): Start=0x01 Stop=0x02 Request=0x03'
- Protocol endpoint IDs defined as constants (0xBEEF for PutBytes 0x34 for AppRunState
  0x1771 for AppFetch)
- 'Pebble protocol framing: length (Uint16 BE) + endpoint (Uint16 BE) + payload'
- BlobDB insert message construction for metadata (research from libpebble2/services/blobdb.py)
- Message parsing handles unknown/unexpected messages gracefully
created: '2026-04-07'
depends_on:
- US-PRJ-8
- US-PRJ-10
- US-PRJ-13
epic_id: EPIC-PRJ-5
id: US-PRJ-14
points: 5
priority: must
status: done
tags:
- mvp
title: Implement Pebble protocol message parser/builder
updated: '2026-04-07'
---

As a developer, I want JS functions to parse incoming Pebble protocol messages and build outgoing ones (beyond PutBytes) so that the installer can handle the AppFetch handshake, slot assignment, and run state messages.