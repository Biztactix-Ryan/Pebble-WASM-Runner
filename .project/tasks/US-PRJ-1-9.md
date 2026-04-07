---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-1-9
points: 1
status: done
story_id: US-PRJ-1
tags: []
title: 'TEST: Verify spec against actual packet captures'
updated: '2026-04-07'
---

Build QEMU natively on Linux, run the emulator, and capture actual FEED/BEEF traffic on the control UART. Compare byte-for-byte against the spec document. Fix any discrepancies. This validates the research before we build on it.