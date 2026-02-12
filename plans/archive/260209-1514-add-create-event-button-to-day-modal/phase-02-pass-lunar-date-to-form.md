# Phase 2: Pass Lunar Date Params to EventForm

## Context Links

- Parent plan: [Implementation Plan](./implementation-plan-day-modal-create-event-button.md)
- Depends on: [Phase 1](./phase-01-add-button-to-modal.md)
- File to modify: `src/app/event/new.tsx`

## Overview

- **Date**: 2026-02-09
- **Priority**: P2
- **Implementation Status**: Completed
- **Review Status**: Pending
- **Description**: Read lunar date from route params and pass to EventForm as initialData

## Key Insights

- EventForm already accepts `initialData?: Partial<EventFormData>` prop
- `useLocalSearchParams()` from expo-router reads query params
- Params come as strings, need to parse to numbers
- EventFormData expects: lunarDay (number), lunarMonth (number), lunarYear (number|undefined), isLeapMonth (boolean)

## Requirements

### Functional
- Read route params if present
- Convert string params to correct types
- Pass to EventForm as initialData
- If no params, form starts with default values (existing behavior)

### Non-Functional
- Type-safe param parsing
- Handle edge cases (missing params, invalid values)

## Architecture

```
/event/new route
├── useLocalSearchParams() → { lunarDay?, lunarMonth?, lunarYear?, isLeapMonth? }
├── Parse strings to numbers/boolean
├── Construct initialData object
└── Pass to <EventForm initialData={...} />
```

## Related Code Files

| File | Action |
|------|--------|
| `src/app/event/new.tsx` | Modify - read params, pass to EventForm |
| `src/components/events/EventForm.tsx` | No changes - already supports initialData |

## Implementation Steps

1. Import `useLocalSearchParams` from `expo-router`
2. Extract params: lunarDay, lunarMonth, lunarYear, isLeapMonth
3. Parse params:
   - `parseInt(lunarDay)` for day/month/year
   - `isLeapMonth === 'true'` for boolean
4. Create initialData object with parsed values
5. Pass to EventForm: `<EventForm initialData={initialData} ... />`

## Code Example

```typescript
const { lunarDay, lunarMonth, lunarYear, isLeapMonth } = useLocalSearchParams<{
    lunarDay?: string;
    lunarMonth?: string;
    lunarYear?: string;
    isLeapMonth?: string;
}>();

const initialData = useMemo(() => {
    if (!lunarDay || !lunarMonth) return undefined;
    return {
        lunarDay: parseInt(lunarDay, 10),
        lunarMonth: parseInt(lunarMonth, 10),
        lunarYear: lunarYear ? parseInt(lunarYear, 10) : undefined,
        isLeapMonth: isLeapMonth === 'true',
    };
}, [lunarDay, lunarMonth, lunarYear, isLeapMonth]);
```

## Todo List

- [ ] Import useLocalSearchParams from expo-router
- [ ] Add useMemo for parsing params
- [ ] Pass initialData to EventForm
- [ ] Test with various param combinations

## Success Criteria

- [ ] Opening /event/new without params shows default form
- [ ] Opening /event/new?lunarDay=15&lunarMonth=1 pre-fills day/month
- [ ] Form fields show correct pre-filled values
- [ ] User can still modify pre-filled values

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Invalid number parsing | Low | Low | parseInt with fallback |
| Missing params break form | Low | Medium | Check params exist before creating initialData |

## Security Considerations

- Validate param values are within expected ranges (day 1-30, month 1-12)
- No user-controllable HTML/code execution risk

## Next Steps

- After Phase 2, feature is complete
- Test end-to-end: Calendar → Day → Create Event → Form with pre-filled date
