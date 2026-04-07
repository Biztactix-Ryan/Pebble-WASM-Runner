---
acceptance_criteria:
- Full install message sequence documented step by step
- AppFetch request/response format documented
- Install slot assignment protocol understood
- Order of PutBytes transfers (binary then resources then worker) confirmed
- Completion and error signaling mechanisms documented
- AppRunState message format documented
created: '2026-04-07'
depends_on: []
epic_id: EPIC-PRJ-5
id: US-PRJ-13
points: 3
priority: must
status: ready
tags:
- research
- mvp
title: Research install sequence from libpebble2
updated: '2026-04-07'
---

As a developer, I want to fully understand the install sequence by studying libpebble2/services/install.py and pebble_tool/commands/install.py so that I can accurately port the orchestration logic.

Need to document: the exact message exchange sequence, how AppFetch works, how install slots are requested and assigned, the order of binary transfers, and how completion/errors are signaled.