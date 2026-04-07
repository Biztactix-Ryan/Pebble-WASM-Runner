---
created: '2026-04-07'
id: EPIC-PRJ-3
points: null
priority: must
status: draft
tags:
- mvp
target_date: null
title: Metadata Conversion
updated: '2026-04-07'
---

Port the PBW manifest-to-install-metadata conversion logic from libpebble2 to JavaScript. The Pebble install protocol requires specific metadata fields (UUID, app name, version, flags, SDK version, etc.) in a binary format. This epic converts the parsed JSON manifest into the protocol-ready metadata structure.

Success criteria:
- UUID is correctly parsed and encoded as 16-byte binary
- App name, company, version fields are extracted and formatted
- App flags (watchface vs app, etc.) are correctly determined
- SDK version is extracted
- Icon resource ID is included
- Output matches the format expected by PebbleOS install protocol

Scope: Metadata field mapping, binary encoding, flag interpretation. Reference: libpebble2/services/install.py