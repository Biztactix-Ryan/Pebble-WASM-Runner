---
created: '2026-04-07'
id: EPIC-PRJ-2
points: null
priority: must
status: active
tags:
- mvp
target_date: null
title: PBW File Parser
updated: '2026-04-07'
---

Implement browser-side PBW file parsing. Let users pick a .pbw file, read it via the File API, unzip it with JSZip, and extract the manifest, app binary, resources, and worker binary into a structured JS object.

Success criteria:
- User can select a .pbw file from the browser
- ZIP contents are extracted and enumerated
- appinfo.json / manifest is parsed into a JS object
- App binary (pebble-app.bin) is extracted as an ArrayBuffer
- Resources (app_resources.pbpack) extracted if present
- Worker (worker.bin) extracted if present
- Output is a clean structured object ready for the installer

Scope: File API usage, JSZip integration, manifest parsing, binary extraction