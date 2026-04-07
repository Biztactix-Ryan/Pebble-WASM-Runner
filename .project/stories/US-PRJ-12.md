---
acceptance_criteria:
- Accepts ArrayBuffer + object type + bank index as input
- Sends INIT and waits for ack with cookie
- Chunks data into appropriate size (2000 bytes default)
- Sends each DATA chunk and waits for ack
- Sends COMMIT with CRC after all data
- Handles error acks by aborting and reporting
- Reports progress (bytes sent / total) via callback
- Async/promise-based API for clean orchestration
created: '2026-04-07'
depends_on:
- US-PRJ-4
- US-PRJ-11
epic_id: EPIC-PRJ-4
id: US-PRJ-12
points: 5
priority: must
status: done
tags:
- mvp
title: Implement PutBytes chunked transfer engine
updated: '2026-04-07'
---

As a developer, I want a PutBytes engine that takes a binary blob and transfers it to the emulator in chunks using the INIT→DATA→COMMIT flow, handling acks at each step, so that app binaries and resources can be installed.