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
status: done
tags:
- research
- mvp
title: Research install sequence from libpebble2
updated: '2026-04-07'
---

As a developer, I want to fully understand the install sequence by studying libpebble2 and pebble-tool so that I can accurately port the orchestration logic.

Key files to read:
- libpebble2/services/install.py — AppInstaller class, two install paths (modern v3+ and legacy v2)
- libpebble2/services/blobdb.py — BlobDB client for metadata insertion (modern path)
- libpebble2/protocol/apps.py — AppMetadata, AppRunState, AppFetch definitions
- pebble_tool/commands/install.py — CLI wrapper, just calls AppInstaller(pebble, pbw)

Modern install sequence (v3+ firmware — OUR TARGET):
1. Build AppMetadata from manifest
2. Insert metadata into BlobDB via BlobDBClient
3. Send AppRunStateStart (endpoint 0x34) to trigger install
4. Receive AppFetchRequest (endpoint 0x1771) from PebbleOS with UUID + app_id
5. Send AppFetchResponse (endpoint 0x1771) with status=Start (0)
6. PutBytes: app binary via PutBytesAppInit (app_id based, NOT bank based)
7. PutBytes: resources via PutBytesAppInit (if present)
8. PutBytes: worker via PutBytesAppInit (if present)

NOTE: We also need to research BlobDB protocol (libpebble2/services/blobdb.py) since the modern path requires it for metadata insertion.

PREREQUISITE: US-PRJ-19 (Bootstrap source repositories) must complete first.