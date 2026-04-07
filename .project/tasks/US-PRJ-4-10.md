---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-4-10
points: 2
status: todo
story_id: US-PRJ-4
tags: []
title: 'TEST: Boot-and-bridge CI smoke test'
updated: '2026-04-07'
---

Create a script suitable for CI that: builds WASM, boots emulator in headless Playwright, runs bridge ping test, exits with pass/fail. This becomes the foundation for all future integration tests on Linux.