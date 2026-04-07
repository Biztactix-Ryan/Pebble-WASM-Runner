---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-16-13
points: 1
status: todo
story_id: US-PRJ-16
tags: []
title: Create CI-compatible test runner script
updated: '2026-04-07'
---

Package the e2e tests into a script runnable by CI: installs dependencies (Playwright, etc.), builds WASM if needed, runs all e2e tests, exits with correct pass/fail code. Document CI requirements.