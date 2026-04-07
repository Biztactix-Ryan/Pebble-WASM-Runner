---
acceptance_criteria:
- UUID encoded as 16-byte binary correctly
- App name and company name encoded as fixed-length strings
- Version major/minor encoded correctly
- App flags (watchface vs app) set from manifest
- SDK version included
- Icon resource ID included
- Output is an ArrayBuffer ready to send as protocol payload
- Matches format expected by PebbleOS (verified against libpebble2 reference)
created: '2026-04-07'
depends_on:
- US-PRJ-7
- US-PRJ-8
epic_id: EPIC-PRJ-3
id: US-PRJ-9
points: 3
priority: must
status: backlog
tags:
- mvp
title: Implement manifest-to-metadata converter in JS
updated: '2026-04-07'
---

As a developer, I want a JS function that takes the parsed PBW manifest object and produces the binary metadata structure expected by PebbleOS so that the installer can send correct app metadata during installation.