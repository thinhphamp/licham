---
title: "Add Events List to DayDetailModal"
description: "Display events occurring on selected day as compact clickable list in DayDetailModal"
status: completed
completed: 2026-02-15T18:28:00+07:00
priority: P2
effort: 1h
branch: fix/event-logo
tags: [ui, events, modal]
created: 2026-02-15
---

# Add Events List to DayDetailModal

## Overview

Add "Su kien" (Events) section to DayDetailModal showing events occurring on selected day as compact clickable list.

## Phases

| Phase | Description | Status | Effort |
|-------|-------------|--------|--------|
| 1 | Implement events list section | pending | 1h |

## Key Context

- **Target file**: `src/components/calendar/DayDetailModal.tsx` (216 lines)
- **Store**: `useEventsStore` from `src/stores/eventStore.ts`
- **Utility**: `isEventOccurring()` from `src/utils/recurrence.ts`
- **Navigation**: expo-router, route to `/event/{id}`

## Architecture

```
DayDetailModal
├── Header (existing)
├── Date Section (existing)
├── Events Section (NEW)
│   ├── Section title "Su kien"
│   ├── Event rows (title + chevron, clickable)
│   └── Empty state "Chua co su kien"
├── Can Chi Section (existing)
└── Auspicious Hours (existing)
```

## Dependencies

- DayInfo contains lunar.day, lunar.month, lunar.year, lunar.leap
- Solar date constructable from solar.day, solar.month, solar.year
- isEventOccurring(event, targetDate, targetLunar) returns boolean

## Success Criteria

1. Events section displays between Date Section and Can Chi Section
2. Shows all events (one-time + recurring) occurring on selected day
3. Compact row style: title left, chevron-forward right
4. Tapping row navigates to /event/{id}
5. Empty state shows "Chua co su kien" when no events
6. No new component files (inline implementation per KISS)
