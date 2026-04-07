---
acceptance_criteria:
- Send a ping or version request and get a valid response
- Verify packet framing is correct in both directions
- Test with the WASM build (not just native QEMU)
- Document the bridge API for downstream consumers
created: '2026-04-07'
depends_on:
- US-PRJ-2
- US-PRJ-3
epic_id: EPIC-PRJ-1
id: US-PRJ-4
points: 3
priority: must
status: backlog
tags:
- mvp
- testing
title: Build and test emulator bridge end-to-end
updated: '2026-04-07'
---

As a developer, I want to verify the bridge works end-to-end by sending a known protocol message and receiving the expected response so that I can confidently build the installer on top of it.