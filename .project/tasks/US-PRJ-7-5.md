---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-7-5
points: 1
status: todo
story_id: US-PRJ-7
tags: []
title: Define PBW output schema
updated: '2026-04-07'
---

Define the canonical output object shape: { uuid, name, version: {major, minor}, companyName, sdkVersion, appFlags, isWatchface, appBinary (ArrayBuffer), resourcesBinary (ArrayBuffer|null), workerBinary (ArrayBuffer|null) }. This interface is the contract between parser and downstream consumers.