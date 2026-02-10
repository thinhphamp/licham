# Phase 1: Fix Today Button Overflow

## Context
- Parent: [Plan](./plan.md)
- Status: completed
- Priority: High (bug fix)
- Effort: 30m

## Problem
"Hôm nay" button is clipped by parent container. Shows "Hôm na" instead of full text.

## Root Cause Analysis
The header is inside react-native-calendars which has constrained width. The `space-between` layout pushes button outside visible area.

## Solution
Option A: Reduce header padding/margins
Option B: Use `flex-shrink: 0` on button to prevent compression
Option C: Position button absolutely within safe bounds

**Recommended**: Option A + B - adjust layout to fit

## Implementation Steps

1. Adjust header styles:
```typescript
header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 0,  // Remove padding, arrows provide space
},
```

2. Ensure button doesn't shrink:
```typescript
todayButton: {
    flexShrink: 0,  // Prevent compression
    paddingHorizontal: 10,  // Slightly smaller
    paddingVertical: 5,
    ...
}
```

## Todo
- [x] Adjust header paddingHorizontal
- [x] Add flexShrink: 0 to button
- [x] Test on various screen sizes
- [x] Verify text fully visible

## Success Criteria
- "Hôm nay" fully visible without clipping
- Layout balanced and visually appealing
