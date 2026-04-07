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

Requires reading libpebble2/services/install.py and related protocol definitions to document the exact field layout, byte order, and encoding.

PREREQUISITE: US-PRJ-19 (Bootstrap source repositories) must complete first — this story reads files from libpebble2.