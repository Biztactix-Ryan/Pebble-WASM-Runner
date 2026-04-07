---
acceptance_criteria:
- 'Output object contains: uuid name version companyName appBinary resourcesBinary
  workerBinary sdkVersion appFlags'
- Fields are null/undefined when not present in PBW
- UUID is validated as proper format
- Tested with multiple real PBW files
created: '2026-04-07'
depends_on:
- US-PRJ-6
epic_id: EPIC-PRJ-2
id: US-PRJ-7
points: 2
priority: must
status: done
tags:
- mvp
title: Parse PBW manifest and build structured output
updated: '2026-04-07'
---

As a developer, I want the PBW parser to produce a clean structured object with all extracted data so that downstream components (metadata converter, installer) have a consistent interface to work with.