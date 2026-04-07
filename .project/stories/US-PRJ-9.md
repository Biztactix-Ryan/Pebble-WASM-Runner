---
acceptance_criteria:
- UUID encoded as 16-byte binary correctly
- App name encoded as 96-char fixed string (null-padded)
- Version major/minor and SDK version as Uint8 pairs
- App flags (Uint32) set from manifest — watchface and worker flags
- Icon resource ID (Uint32) included
- app_face_bg_color and app_face_template_id included
- Output is an ArrayBuffer matching AppMetadata layout from libpebble2/protocol/apps.py
- Byte-comparison verified against libpebble2 reference output
created: '2026-04-07'
depends_on:
- US-PRJ-7
- US-PRJ-8
epic_id: EPIC-PRJ-3
id: US-PRJ-9
points: 3
priority: must
status: done
tags:
- mvp
title: Implement manifest-to-metadata converter in JS
updated: '2026-04-07'
---

As a developer, I want a JS function that takes the parsed PBW manifest object and produces the binary metadata structure expected by PebbleOS so that the installer can send correct app metadata during installation.