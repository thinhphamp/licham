# Phase 2: Add Mode Selector UI

## Context
- Parent: [Plan Overview](./plan.md)
- Depends on:- **Implementation Status**: Completed
- **Review Status**: Pending

## Overview
Add toggle/buttons in EventForm to select between single-day and recurring yearly modes.

## Key Insights
- Similar pattern to existing EventType buttons (Ngày Giỗ / Cá nhân)
- Place below date picker for logical flow
- Vietnamese labels: "Một lần" (Single) / "Hàng năm" (Yearly)

## Requirements
- Mode selector with two options
- Show year picker only for "single" mode
- Default to "recurring" (Hàng năm)
- Visual indication of selected mode

## Related Code Files
- `src/components/events/EventForm.tsx` (modify)

## Architecture
```
EventForm
├── Title input
├── Description input
├── Event Type selector (existing)
├── Lunar Date picker (existing)
├── **NEW: Recurrence Mode selector**
│   ├── "Một lần" (single) - shows year
│   └── "Hàng năm" (recurring) - no year
├── Leap month toggle
├── Solar date display
├── Reminder settings
└── Submit buttons
```

## Implementation Steps

1. Add state for recurrenceMode:
```typescript
const [recurrenceMode, setRecurrenceMode] = useState<RecurrenceMode>(
    initialData?.lunarYear ? 'single' : 'recurring'
);
```

2. Add mode selector UI (similar to typeButtons):
```tsx
<View style={styles.field}>
    <Text style={[styles.label, { color: theme.text }]}>Chế độ lặp</Text>
    <View style={styles.typeButtons}>
        <TouchableOpacity onPress={() => setRecurrenceMode('single')}>
            🗓️ Một lần
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRecurrenceMode('recurring')}>
            🔄 Hàng năm
        </TouchableOpacity>
    </View>
</View>
```

3. Show year picker only when mode is 'single':
```tsx
{recurrenceMode === 'single' && (
    <Picker for year selection />
)}
```

4. Update handleSubmit to include lunarYear:
```typescript
onSubmit({
    ...data,
    lunarYear: recurrenceMode === 'single' ? selectedYear : undefined,
});
```

## Todo
- [x] Add recurrenceMode state
- [x] Create mode selector buttons
- [x] Add year picker for single mode
- [x] Update form submission
- [x] Style to match existing UI

## Success Criteria
- Mode selector renders correctly
- Single mode shows year picker
- Recurring mode hides year picker
- Form submits correct data
