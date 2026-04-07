---
acceptance_criteria:
- Install button enabled after PBW is loaded
- Progress bar shows transfer progress (bytes/total)
- Phase indicator shows current step (metadata/binary/resources/worker)
- Success message displayed when install completes
- Error message with details displayed on failure
- Button disabled during install to prevent double-submit
created: '2026-04-07'
depends_on:
- US-PRJ-15
- US-PRJ-17
epic_id: EPIC-PRJ-6
id: US-PRJ-18
points: 3
priority: must
status: backlog
tags:
- mvp
title: Install button with progress and status
updated: '2026-04-07'
---

As a user, I want to click an Install button and see a progress indicator during installation, then a clear success or error message when it completes, so that I know what's happening.