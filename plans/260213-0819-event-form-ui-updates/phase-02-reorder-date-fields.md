# Phase 2: Reorder Date Fields

## Context
- Parent: [plan.md](plan.md)
- Target: `src/components/events/EventForm.tsx`
- Depends on: Phase 1

## Overview
- **Priority**: P2
- **Status**: Completed
- **Effort**: 10m

Move "Ngày dương lịch" (solar date) display to appear ABOVE "Ngày âm lịch" (lunar date) picker section.

## Current Order (lines 265-333)
1. Label "Ngày âm lịch"
2. Day/Month/Year pickers
3. Leap month switch (removed in Phase 1)
4. Solar date display

## Target Order
1. **Solar date display** (moved up, shown first)
2. Label "Ngày âm lịch"
3. Day/Month/Year pickers

## Implementation Steps

1. **Extract solar date display block** (lines 323-332)
2. **Move before lunar date section** (before line 266)
3. **Adjust label to clarify context**

## Code Changes

### Current location (remove from here):
```tsx
{solarDate && (
    <View style={styles.solarDateRow}>
        <Text style={[styles.solarDateLabel, { color: theme.textMuted }]}>
            Ngày dương lịch:
        </Text>
        <Text style={[styles.solarDateValue, { color: theme.text }]}>
            {solarDate.day.toString().padStart(2, '0')}/{solarDate.month.toString().padStart(2, '0')}/{solarDate.year}
        </Text>
    </View>
)}
```

### New structure:
```tsx
{/* Solar Date Display - FIRST */}
{solarDate && (
    <View style={[styles.field, styles.solarDateField]}>
        <Text style={[styles.label, { color: theme.text }]}>Ngày dương lịch</Text>
        <Text style={[styles.solarDateValue, { color: theme.textSecondary }]}>
            {solarDate.day.toString().padStart(2, '0')}/{solarDate.month.toString().padStart(2, '0')}/{solarDate.year}
        </Text>
    </View>
)}

{/* Lunar Date - SECOND */}
<View style={styles.field}>
    <Text style={[styles.label, { color: theme.text }]}>Ngày âm lịch</Text>
    {/* Day/Month/Year pickers */}
</View>
```

### Add style (if needed):
```tsx
solarDateField: {
    marginBottom: 8, // Tighter spacing before lunar picker
},
```

## Related Files
- `src/components/events/EventForm.tsx`

## Success Criteria
- [ ] Solar date appears above lunar date section
- [ ] Labels clearly distinguish the two date types
- [ ] Responsive layout maintained

## Risk Assessment
- **Low risk** - UI reordering only
