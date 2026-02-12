---
title: "Event Creation Modes: Single Day vs Loop"
description: "Add mode selector for one-time or recurring yearly events"
status: completed
priority: P2
effort: 2h
branch: main
tags: [feature, events, ui]
created: 2026-02-10
---

# Event Creation Modes

## Overview
Add UI to choose between "single day" (one-time) and "loop" (recurring yearly) event modes. Infrastructure already exists via optional `lunarYear` field.

## Current State
- `LunarEvent.lunarYear?: number` - undefined = recurring, set = one-time
- UI doesn't expose this choice - all events currently recurring

## Target State
- Mode selector in EventForm: "Một lần" (Single) vs "Hàng năm" (Yearly)
- Single mode: saves specific lunarYear
- Loop mode: lunarYear remains undefined
- Calendar displays both correctly

## Phases

| # | Phase | Status | Effort |
|---|-------|--------|--------|
| 1 | [Update Types](./phase-01-update-types.md) | completed | 30m |
| 2 | [Add Mode Selector UI](./phase-02-mode-selector-ui.md) | completed | 1h |
| 3 | [Update Event Display](./phase-03-event-display.md) | completed | 30m |

## Key Files
- `src/types/event.ts` - Add RecurrenceMode type
- `src/components/events/EventForm.tsx` - Add mode selector
- `src/components/calendar/CalendarView.tsx` - Update event matching

## Success Criteria
- [x] User can toggle between single/recurring mode
- [x] Single events only show in their specific year
- [x] Recurring events show every year
- [x] Backward compatible with existing events
