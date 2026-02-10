---
title: "Year Selector for MonthYearPickerModal"
description: "Add clickable year header to toggle between month and year grid views"
status: completed
priority: P3
effort: 1h
branch: main
tags: [ui, calendar, enhancement]
created: 2026-02-10
---

# Year Selector for MonthYearPickerModal

## Overview

Add clickable year selection functionality to the `MonthYearPickerModal` component. When users tap the year header ("Năm 2026"), the modal toggles to show a 12-year grid for direct year selection.

## Current State

- File: `src/components/calendar/MonthYearPickerModal.tsx` (168 lines)
- Year navigation: chevron buttons only (increment/decrement by 1)
- Year display: static text "Năm {selectedYear}"
- Month grid: 3x4 layout with "Tháng 1" through "Tháng 12"

## Target State

- Year header clickable → toggles to year grid view
- Year grid: 3x4 layout showing 12 consecutive years
- Chevrons navigate year ranges (e.g., 2020-2031 → 2032-2043)
- Visual indicator that year header is clickable
- Smooth transition between views

## Implementation Phases

| Phase | Description | Status |
|-------|-------------|--------|
| [Phase 1](./phase-01-add-year-grid-view-toggle.md) | Add view mode state and year grid view | Completed |

## UX Flow

```
1. Open modal → Month view (default)
2. Tap "Năm 2026" → Year view (2020-2031)
3. Chevron navigation → 2032-2043, etc.
4. Tap "2030" → Month view with year=2030
5. Tap month → onSelect(2030, month) + close
```

## Success Criteria

- [x] Year header visually indicates clickability
- [x] Toggle between month/year views works
- [x] Year grid matches month grid styling
- [x] Selected year highlighted in year view
- [x] Chevron navigation works in both views
- [x] No regressions to existing functionality

## Dependencies

None - single component enhancement.

## Related Files

- `src/components/calendar/MonthYearPickerModal.tsx`
- `src/components/calendar/CalendarView.tsx` (consumer)
