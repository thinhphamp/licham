# Phase 2: Add Month/Year Picker

## Context
- Parent: [Plan](./plan.md)
- Depends on: Phase 1
- Status: completed
- Priority: Medium (feature)
- Effort: 1.5h

## Overview
Allow users to tap month header ("February 2026") to open a picker modal for quick month/year navigation.

## Requirements
- Modal with month grid (1-12)
- Year selector (scroll or +/- buttons)
- Vietnamese month names
- Current month highlighted
- Select → navigate calendar to that month

## Architecture
```
CalendarView
├── renderHeader (existing)
│   └── TouchableOpacity wrapping month text → opens modal
├── MonthYearPickerModal (new)
│   ├── Year selector row
│   ├── Month grid (3x4)
│   └── Cancel/Confirm buttons
```

## Implementation Steps

1. Add state for picker modal:
```typescript
const [isPickerVisible, setIsPickerVisible] = useState(false);
```

2. Wrap month text in TouchableOpacity:
```typescript
<TouchableOpacity onPress={() => setIsPickerVisible(true)}>
    <Text>{monthName}</Text>
    <Ionicons name="chevron-down" size={16} />
</TouchableOpacity>
```

3. Create MonthYearPickerModal component:
- Props: visible, currentDate, onSelect, onClose
- Month names: ['Th1', 'Th2', ... 'Th12']
- Year range: currentYear - 50 to currentYear + 10

4. Handle selection:
```typescript
const handleMonthSelect = (year: number, month: number) => {
    const newDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    setCurrentMonth(newDate);
    setIsPickerVisible(false);
};
```

## Related Code Files
- `src/components/calendar/CalendarView.tsx` (modify)
- `src/components/calendar/MonthYearPickerModal.tsx` (create)

## Todo
- [x] Add picker modal state
- [x] Create MonthYearPickerModal component
- [x] Add chevron-down icon to header
- [x] Wire up navigation on selection
- [x] Style to match app theme

## Success Criteria
- Tapping header opens modal
- Can select any month/year
- Calendar navigates correctly
- Modal dismissible by cancel or outside tap
