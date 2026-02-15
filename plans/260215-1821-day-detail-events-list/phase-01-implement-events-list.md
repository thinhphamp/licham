---
phase: 1
title: "Implement Events List Section"
status: completed
effort: 1h
---

# Phase 1: Implement Events List Section

## Context Links

- [DayDetailModal.tsx](/src/components/calendar/DayDetailModal.tsx)
- [eventStore.ts](/src/stores/eventStore.ts)
- [recurrence.ts](/src/utils/recurrence.ts)
- [event types](/src/types/event.ts)

## Overview

Add events section to DayDetailModal between Date Section and Can Chi Section showing compact clickable event rows.

## Requirements

### Functional
- Filter events using `isEventOccurring()` for both one-time and recurring events
- Display as compact list with title and chevron
- Navigate to `/event/{id}` on tap
- Show empty state "Chua co su kien" when no events

### Non-functional
- No new component files (inline per KISS)
- Minimal re-renders via useMemo

## Related Code Files

### Modify
- `src/components/calendar/DayDetailModal.tsx`

## Implementation Steps

### Step 1: Add imports (line ~1-5)

```tsx
import { useEventsStore } from '@/stores/eventStore';
import { isEventOccurring } from '@/utils/recurrence';
```

### Step 2: Add events filtering logic (after line 31, inside component)

```tsx
// Get events for this day
const events = useEventsStore((state) => state.events);

const dayEvents = useMemo(() => {
    const targetDate = new Date(solar.year, solar.month - 1, solar.day);
    const targetLunar = {
        day: lunar.day,
        month: lunar.month,
        year: lunar.year,
        leap: lunar.leap,
    };

    return events.filter((event) =>
        isEventOccurring(event, targetDate, targetLunar)
    );
}, [events, solar, lunar]);
```

### Step 3: Add navigation handler (after handleCreateEvent)

```tsx
const handleEventPress = (eventId: string) => {
    onClose();
    router.push(`/event/${eventId}`);
};
```

### Step 4: Add Events Section JSX (between dateSection and canChiSection, ~line 93-95)

```tsx
{/* Events Section */}
<View style={[styles.eventsSection, { borderBottomColor: theme.border }]}>
    <Text style={[styles.sectionTitle, { color: theme.text }]}>Su kien</Text>
    {dayEvents.length === 0 ? (
        <Text style={[styles.emptyEvents, { color: theme.textMuted }]}>
            Chua co su kien
        </Text>
    ) : (
        dayEvents.map((event) => (
            <TouchableOpacity
                key={event.id}
                style={styles.eventRow}
                onPress={() => handleEventPress(event.id)}
            >
                <View style={[styles.eventDot, { backgroundColor: event.color || theme.primary }]} />
                <Text style={[styles.eventTitle, { color: theme.text }]} numberOfLines={1}>
                    {event.title}
                </Text>
                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </TouchableOpacity>
        ))
    )}
</View>
```

### Step 5: Add styles (in StyleSheet.create)

```tsx
eventsSection: {
    paddingVertical: 16,
    borderBottomWidth: 1,
},
emptyEvents: {
    fontSize: 14,
    fontStyle: 'italic',
},
eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
},
eventDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
},
eventTitle: {
    flex: 1,
    fontSize: 15,
},
```

## Todo List

- [ ] Add imports for useEventsStore and isEventOccurring
- [ ] Add events filtering with useMemo
- [ ] Add handleEventPress navigation handler
- [ ] Add Events Section JSX between date and canChi sections
- [ ] Add styles for eventsSection, emptyEvents, eventRow, eventDot, eventTitle
- [ ] Test with one-time events
- [ ] Test with recurring events
- [ ] Test empty state
- [ ] Test navigation to event detail

## Success Criteria

1. Events section renders between Date and Can Chi sections
2. One-time events on selected day display correctly
3. Recurring events (yearly lunar, etc.) display correctly
4. Empty state shows when no events
5. Tapping event navigates to /event/{id}
6. Color dot reflects event.color or primary fallback

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Performance with many events | useMemo ensures filtering only on dependency change |
| isEventOccurring edge cases | Already tested utility, handles all recurrence types |

## Next Steps

After implementation:
1. Manual test on device/simulator
2. Verify recurrence patterns work correctly
3. No additional phases needed - feature complete
