---
acceptance_criteria:
- Takes parsed PBW object as input
- Inserts AppMetadata into BlobDB (modern v3+ path)
- Sends AppRunStateStart to trigger install flow
- Handles AppFetchRequest from PebbleOS and responds with AppFetchResponse status=Start
- PutBytes app binary via PutBytesAppInit (uses app_id not bank index)
- PutBytes resources via PutBytesAppInit if present
- PutBytes worker via PutBytesAppInit if present
- Sends PutBytesInstall after each transfer
- Detects and reports completion
- Detects and reports errors at each phase
- Emits progress events for UI consumption
- Async API returns promise
created: '2026-04-07'
depends_on:
- US-PRJ-9
- US-PRJ-12
- US-PRJ-14
epic_id: EPIC-PRJ-5
id: US-PRJ-15
points: 8
priority: must
status: backlog
tags:
- mvp
title: Implement install flow orchestrator
updated: '2026-04-07'
---

As a developer, I want an installer class/module that orchestrates the full app install sequence — from metadata insertion through all PutBytes transfers to completion — so that a single function call installs a parsed PBW into the emulator.