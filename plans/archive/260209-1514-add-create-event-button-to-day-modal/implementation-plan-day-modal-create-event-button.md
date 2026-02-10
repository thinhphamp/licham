---
title: "Add Create Event Button to Day Detail Modal"
description: "Add button in DayDetailModal to create events with pre-filled lunar date"
status: completed
priority: P2
effort: 1h
branch: main
tags: [ui, events, calendar, navigation]
created: 2026-02-09
---

# Add Create Event Button to Day Detail Modal

## Overview

When user clicks on a specific day in the calendar, the DayDetailModal opens showing day info (lunar date, Can-Chi, auspicious hours). Currently, there's no quick way to create an event for that day from this modal.

**Goal**: Add a "Create Event" button that navigates to `/event/new` with the lunar date pre-filled.

## Current State

- `CalendarView` renders calendar grid with day cells
- Clicking a day opens `DayDetailModal` with `dayInfo` prop containing lunar date
- Event creation exists at `/event/new` but requires manual date selection
- `EventForm` accepts `initialData` prop for pre-filling values

## Implementation Phases

| Phase | Description | Status |
|-------|-------------|--------|
| [Phase 1](./phase-01-add-button-to-modal.md) | Add create event button to DayDetailModal | Completed |
| [Phase 2](./phase-02-pass-lunar-date-to-form.md) | Update route to pass lunar date params | Completed |

## Files to Modify

1. `src/components/calendar/DayDetailModal.tsx` - Add button + navigation
2. `src/app/event/new.tsx` - Read route params, pass to EventForm

## Success Criteria

- [x] Button visible in DayDetailModal (styled consistently with app theme)
- [x] Clicking button navigates to event creation screen
- [x] Lunar date fields pre-filled from selected day
- [x] Modal closes when navigating away
- [x] Back navigation returns to calendar (not modal)

## Dependencies

- expo-router for navigation
- Existing EventForm component (no changes needed - already accepts initialData)
