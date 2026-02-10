---
title: "Display Both Lunar & Solar Calendars in EventForm"
description: "Show corresponding solar date when user selects lunar date in event creation form"
status: completed
priority: P2
effort: 1h
branch: main
tags: [ui, eventform, calendar, lunar-solar-conversion]
created: 2026-02-09
---

# Display Both Lunar & Solar Calendars in EventForm

## Summary

When creating/editing events, users currently only see lunar date pickers. This enhancement adds a computed solar date display below the lunar date selection, helping users understand when the event falls on the Gregorian calendar.

## Current State

- `EventForm.tsx` (345 lines) shows lunar date picker only (day 1-30, month 1-12, leap month toggle)
- No solar date reference displayed
- `lunarToSolar()` converter exists in `src/services/lunar/converter.ts`

## Goal

Display solar date (DD/MM/YYYY) that updates dynamically when user changes lunar date selection.

## Phases

| Phase | Name | Status | Effort |
|-------|------|--------|--------|
| 01 | Add solar date display to EventForm | Completed | 1h |

## Key Files

- `src/components/events/EventForm.tsx` - UI modification
- `src/services/lunar/converter.ts` - Use `lunarToSolar()` function

## Success Criteria

- [x] Solar date shown below lunar date pickers
- [x] Updates in real-time as lunar date changes
- [x] Uses current year for conversion
- [x] Handles invalid dates gracefully
- [x] Follows existing code standards
