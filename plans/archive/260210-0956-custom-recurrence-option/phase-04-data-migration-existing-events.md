# Phase 4: Data Migration

## Context
- Parent: [Plan Overview](./plan.md)
- Depends on: Phase 1, 2, 3
- Status: completed
- Priority: Medium
- Effort: 15m

## Overview
Ensure existing "Hàng năm" events are automatically updated to the new recurrence format without user intervention.

## Strategy
Update `eventStore.ts` constructor or a dedicated migration helper to check for events missing the `recurrence` property.

### Default Mapping:
- If `lunarYear` is NOT undefined → Single event (no recurrence needed).
- If `lunarYear` is undefined → Recurring event → Set `recurrence = { frequency: 1, unit: 'year', system: 'lunar' }`.

## Implementation Steps

1. **Migration Hook**:
   Add a block in `useEventsStore` initialization or `persist` `onRehydrateStorage`.

2. **Validation**:
   Log the number of migrated events for debugging.

## Related Code Files
- `src/stores/eventStore.ts` (modify)

## Todo
- [ ] Define migration logic inside the store
- [ ] Test migration with mock legacy data
- [ ] Verify existing events are still visible in calendar

## Success Criteria
- Old events behave exactly as they did before.
- `LunarEvent` objects in storage now all conform to the new schema.
