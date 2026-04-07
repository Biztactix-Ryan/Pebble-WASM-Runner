---
acceptance_criteria:
- Upload a known-good .pbw file
- Parser extracts all components correctly
- Metadata is accepted by emulated PebbleOS
- Binary transfer completes without errors
- App appears and runs in the emulator
- Test with at least one watchface and one app PBW
created: '2026-04-07'
depends_on:
- US-PRJ-15
epic_id: EPIC-PRJ-5
id: US-PRJ-16
points: 3
priority: must
status: backlog
tags:
- mvp
- testing
title: End-to-end install test with real PBW
updated: '2026-04-07'
---

As a developer, I want to verify the complete pipeline works end-to-end by installing a real .pbw file into the WASM emulator and seeing the app run so that we can confirm the MVP is functional.