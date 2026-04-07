---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-8-5
points: 1
status: done
story_id: US-PRJ-8
tags: []
title: Read and annotate libpebble2/services/install.py metadata handling
updated: '2026-04-07'
---

Read the install service code. Extract: how app metadata is structured for the AppFetch response, which fields are included, their types/sizes, byte order. Focus on the _handle_app_fetch method and AppMetadata construction.