---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-10-11
points: 1
status: done
story_id: US-PRJ-10
tags: []
title: Document PutBytes ACK response format and error codes
updated: '2026-04-07'
---

ACK layout: command byte, cookie (uint32), status (uint8). Document all status codes: ACK, NACK, error values. Document what each error means and when the watch sends it.