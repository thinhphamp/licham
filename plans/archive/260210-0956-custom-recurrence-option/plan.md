---
title: "Custom Recurrence Option"
description: "Replace yearly recurrence with flexible interval-based recurring events"
status: pending
priority: P2
effort: 2h
branch: main
tags: [feature, events, ui, forms]
created: 2026-02-10
---

# Custom Recurrence Option

## Overview

Replace the current "Hàng năm" (yearly) recurrence with a flexible custom recurrence system:
- Interval value (1-99)
- Interval unit (day, week, month, year)
- Date system choice (solar or lunar)

## Current State

- `RecurrenceMode`: `'single' | 'recurring'`
- "Recurring" = yearly on same lunar date (hardcoded)
- No interval customization

## Target State

- "Lặp lại" (Recurring) shows interval controls
- User inputs: interval number + unit + date system
- Backwards compatible: existing yearly events = {value:1, unit:'year', dateSystem:'lunar'}

## Phases

| # | Phase | Status | Effort |
|---|-------|--------|--------|
| 1 | [Update Type Definitions](./phase-01-update-type-definitions.md) | completed | 15m |
| 2 | [Update EventForm UI](./phase-02-update-event-form-ui.md) | completed | 45m |
| 3 | [Update Event Store Logic](./phase-03-update-event-store-logic.md) | completed | 30m |
| 4 | [Data Migration](./phase-04-data-migration-existing-events.md) | completed | 15m |
| 5 | [Testing](./phase-05-testing-and-validation.md) | pending | 15m |

## Key Files

- `src/types/event.ts`
- `src/components/events/EventForm.tsx`
- `src/stores/eventStore.ts`

## Success Criteria

- [ ] User can select "Lặp lại" and configure interval
- [ ] User can choose solar/lunar date system
- [ ] Existing events continue working
- [ ] Notifications schedule correctly
