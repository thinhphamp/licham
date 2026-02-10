# Phase 1: Update Event Types

## Context
- Parent: [Plan Overview](./plan.md)
- **Implementation Status**: Completed
- **Review Status**: Pending
- Priority: High
- Effort: 30m

## Overview
Add `RecurrenceMode` type and update `EventFormData` interface.

## Key Insights
- `lunarYear` already supports undefined (recurring) vs set (one-time)
- Need explicit mode type for clearer UI logic

## Requirements
- Add `RecurrenceMode = 'single' | 'recurring'` type
- Add `recurrenceMode` field to `EventFormData`
- Keep backward compatible (existing events = recurring)

## Related Code Files
- `src/types/event.ts` (modify)

## Implementation Steps

1. Add RecurrenceMode type:
```typescript
export type RecurrenceMode = 'single' | 'recurring';
```

2. Add to EventFormData:
```typescript
recurrenceMode: RecurrenceMode;
```

3. Default: `'recurring'` for backward compatibility

## Todo
- [x] Add RecurrenceMode type
- [x] Update EventFormData interface
- [x] Verify TypeScript compiles

## Success Criteria
- Types compile without errors
- RecurrenceMode exported from types file
