---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-7-6
points: 1
status: todo
story_id: US-PRJ-7
tags: []
title: Implement manifest parser and field mapper
updated: '2026-04-07'
---

Parse appinfo.json fields into the output schema. Handle: uuid (string→validated), shortName/longName, companyName, versionLabel (parse major.minor), sdkVersion, watchapp.watchface flag, resources.media[0] for icon ID. Handle missing optional fields with defaults.