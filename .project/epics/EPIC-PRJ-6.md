---
created: '2026-04-07'
id: EPIC-PRJ-6
points: null
priority: must
status: active
tags:
- mvp
target_date: null
title: Browser UI
updated: '2026-04-09'
---

Build a simple browser interface for the PBW installer integrated into the existing index.html. Provides file upload, metadata display, install button, progress feedback, and status messages.

Success criteria:
- File input to select .pbw files
- Displays parsed app metadata (name, version, company) after upload
- Install button triggers the install flow
- Progress bar/indicator during binary transfer
- Success/error messages displayed clearly
- Integrates cleanly with the existing emulator UI in index.html

Scope: HTML/CSS/JS UI components, event wiring to installer API. Future: installed app list, uninstall support.