---
created: '2026-04-07'
id: EPIC-PRJ-5
points: null
priority: must
status: draft
tags:
- mvp
target_date: null
title: Install Flow Orchestrator
updated: '2026-04-07'
---

Port the full Pebble app install sequence from libpebble2/services/install.py to JavaScript. This orchestrates the end-to-end install: inserting metadata, handling slot assignment from PebbleOS, then using PutBytes to send the app binary, resources, and worker in sequence.

Success criteria:
- Sends app metadata to PebbleOS (AppFetch response)
- Handles install slot request/assignment from the watch
- Coordinates PutBytes transfers in correct order (binary → resources → worker)
- Handles AppRunState and completion signals
- Reports progress through each phase
- Handles and surfaces errors at each step
- Works end-to-end: .pbw upload → app running in emulator

Scope: Install sequence orchestration, AppFetch protocol, slot management, response routing. Reference: libpebble2/services/install.py + pebble_tool/commands/install.py