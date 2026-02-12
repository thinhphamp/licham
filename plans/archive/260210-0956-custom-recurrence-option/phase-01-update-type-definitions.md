# Phase 1: Update Type Definitions

## Context
- Parent: [Plan Overview](./plan.md)
- Status: completed
- Priority: High
- Effort: 15m

## Overview
Update the TypeScript interfaces to support flexible recurrence intervals and solar/lunar systems.

## Requirements
- Define `RecurrenceUnit` ('day', 'week', 'month', 'year')
- Define `DateSystem` ('solar', 'lunar')
- Create `RecurrenceConfig` interface
- Update `LunarEvent` and `EventFormData`

## Implementation Detail

### 1. New Types
```typescript
export type RecurrenceUnit = 'day' | 'week' | 'month' | 'year';
export type DateSystem = 'solar' | 'lunar';

export interface RecurrenceConfig {
    frequency: number;       // e.g., 2 (bi-weekly)
    unit: RecurrenceUnit;    // e.g., 'week'
    system: DateSystem;      // e.g., 'solar'
}
```

### 2. Update LunarEvent
Add `recurrence?: RecurrenceConfig`. 
Keep `lunarYear` for single-occurrence events.

### 3. Update EventFormData
Include the new `recurrence` object.

## Related Code Files
- `src/types/event.ts` (modify)

## Todo
- [x] Add RecurrenceUnit and DateSystem types
- [x] Define RecurrenceConfig interface
- [x] Update LunarEvent interface
- [x] Update EventFormData interface
- [x] Verify compilation

## Success Criteria
- [x] Codebase compiles without errors
- [x] Type definitions are clear and extensible
