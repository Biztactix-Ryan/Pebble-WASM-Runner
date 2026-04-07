---
assignee: null
created: '2026-04-07'
depends_on: []
id: US-PRJ-9-16
points: 2
status: done
story_id: US-PRJ-9
tags: []
title: 'TEST: Byte-comparison against libpebble2 reference output (Node.js)'
updated: '2026-04-07'
---

For each test vector from US-PRJ-8, run buildAppMetadata() with the same input manifest and compare the output byte-for-byte against the Python-generated reference. This is the gold standard test. Any byte mismatch = bug.