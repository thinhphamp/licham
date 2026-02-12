# Phase 2: Update EventForm UI

## Context
- Parent: [Plan Overview](./plan.md)
- Depends on: Phase 1
- Status: completed
- Priority: High
- Effort: 45m

## Overview
Modify `EventForm.tsx` to allow users to configure custom recurrence. 

## Key UX Decisions
- For "Lặp lại" (Recurring) mode, show a summary like "Hàng năm (Âm lịch)"
- Tapping the summary opens a configured sub-section or modal
- Vietnamese labels: 
  - "Tần suất": Frequency (1, 2, 3...)
  - "Đơn vị": Unit (Ngày, Tuần, Tháng, Năm)
  - "Hệ lịch": System (Âm lịch, Dương lịch)

## Implementation Steps

1. **State Management**:
   ```typescript
   const [recurrence, setRecurrence] = useState<RecurrenceConfig>({
       frequency: 1,
       unit: 'year',
       system: 'lunar'
   });
   ```

2. **UI Components**:
   - Add a numeric input for frequency.
   - Add Pickers for Unit and System.
   - Conditionally hide "Lunar" system for "Week" or "Day" units if too complex for V1.

3. **Logic**:
   - Update `handleSubmit` to pass the `recurrence` object when `recurrenceMode === 'recurring'`.

## Related Code Files
- `src/components/events/EventForm.tsx` (modify)

## Todo
- [ ] Add frequency numeric input
- [ ] Add Unit picker (Day, Week, Month, Year)
- [ ] Add System picker (Solar, Lunar)
- [ ] Handle UI state transitions between modes
- [ ] Style consistent with theme

## Success Criteria
- User can successfully input "Every 2 Weeks (Solar)"
- Form validation prevents invalid frequencies (e.g., 0 or negative)
- UI feels clean and intuitive
