---
acceptance_criteria:
- Document exact metadata binary layout (fields sizes offsets byte order)
- Identify all protocol message types involved (AppFetch etc.)
- Map manifest JSON fields to protocol metadata fields
- Document app flag values and their meanings
created: '2026-04-07'
depends_on: []
epic_id: EPIC-PRJ-3
id: US-PRJ-8
points: 3
priority: must
status: ready
tags:
- research
- mvp
title: Research libpebble2 app metadata format
updated: '2026-04-07'
---

As a developer, I want to understand the exact binary metadata format that PebbleOS expects during app installation so that I can correctly encode metadata from the PBW manifest.

Key files to read in libpebble2:
- libpebble2/protocol/apps.py — AppMetadata structure, AppRunState (endpoint 0x34), AppFetch (endpoint 0x1771)
- libpebble2/services/install.py — how AppMetadata is constructed and inserted via BlobDB

AppMetadata fields (from protocol/apps.py):
uuid, app_version_major, app_version_minor, sdk_version_major, sdk_version_minor, flags (Uint32), icon (Uint32), app_face_bg_color (Uint8), app_face_template_id (Uint8), app_name (96-char fixed string)

AppFetch (endpoint 0x1771):
- Request: command=0x01, uuid (UUID), app_id (Uint32)
- Response: command=0x01, response (Uint8: Start=0, Busy=1, InvalidUUID=2, NoData=3)

AppRunState (endpoint 0x34):
- Start: command=0x01, uuid
- Stop: command=0x02, uuid
- Request: command=0x03

PREREQUISITE: US-PRJ-19 (Bootstrap source repositories) must complete first.