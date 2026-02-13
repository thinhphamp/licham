# Phase 1: Remove Leap Month Switch

## Context
- Parent: [plan.md](plan.md)
- Target: `src/components/events/EventForm.tsx`

## Overview
- **Priority**: P2
- **Status**: Completed
- **Effort**: 5m

Remove the "Tháng nhuận" (leap month) toggle switch from the event form UI. Keep the state variable but default it to `false`.

## Implementation Steps

1. **Remove leap month switch UI** (lines 314-321)
   - Delete the entire `<View style={styles.switchRow}>` block containing the leap month toggle

2. **Update state initialization**
   - Keep `isLeapMonth` state but ensure it defaults to `false`
   - Current: `useState(initialData?.isLeapMonth ?? false)` - already correct

## Code Changes

### Remove this block (lines 314-321):
```tsx
// DELETE THIS ENTIRE BLOCK
<View style={styles.switchRow}>
    <Text style={[styles.switchLabel, { color: theme.textSecondary }]}>Tháng nhuận</Text>
    <Switch
        value={isLeapMonth}
        onValueChange={setIsLeapMonth}
        trackColor={{ false: theme.border, true: theme.primary }}
    />
</View>
```

## Related Files
- `src/components/events/EventForm.tsx` - Main target

## Success Criteria
- [ ] Leap month switch not visible in form
- [ ] `isLeapMonth` still passed in form submission (defaults false)
- [ ] No TypeScript errors

## Risk Assessment
- **Low risk** - Simple UI removal, no logic changes
