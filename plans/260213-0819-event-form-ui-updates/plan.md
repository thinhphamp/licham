---
title: "Event Form UI Updates"
description: "Remove Thang Nhuan, reorder date fields, change Alert time to dropdown"
status: completed
priority: P2
effort: 30m
branch: feat/docs-update
tags: [ui, event-form, dropdown]
created: 2026-02-13
---

# Event Form UI Updates

## Summary

Modify `EventForm.tsx` with three UI changes:
1. Remove "Tháng nhuận" (leap month) switch
2. Move "Ngày dương lịch" display ABOVE "Ngày âm lịch" section
3. Replace reminder time TextInput with dropdown (30-min intervals)

## Target File

- `src/components/events/EventForm.tsx`

## Current State Analysis

**Tháng nhuận (Leap Month)** - Lines 314-321
```tsx
<View style={styles.switchRow}>
    <Text style={[styles.switchLabel, { color: theme.textSecondary }]}>Tháng nhuận</Text>
    <Switch
        value={isLeapMonth}
        onValueChange={setIsLeapMonth}
        ...
    />
</View>
```

**Date Display Order** - Lines 265-333
Current order:
1. Label "Ngày âm lịch"
2. Day/Month/Year pickers
3. Leap month switch
4. Solar date display ("Ngày dương lịch")

**Alert Time** - Lines 367-375
Currently uses TextInput for time entry.

## Implementation Phases

| Phase | Description | Status |
|-------|-------------|--------|
| [Phase 1](phase-01-remove-leap-month.md) | Remove Tháng nhuận switch | Completed |
| [Phase 2](phase-02-reorder-date-fields.md) | Move solar date above lunar date | Completed |
| [Phase 3](phase-03-alert-dropdown.md) | Convert alert time to dropdown | Completed |

## Success Criteria

- [x] Leap month switch removed from UI
- [x] `isLeapMonth` state defaults to `false`
- [x] Solar date displayed before lunar date picker
- [x] Alert time uses Picker with 30-min intervals
- [ ] No TypeScript errors
- [ ] Existing functionality preserved
