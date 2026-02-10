# Journal: Calendar Feature Implementations

## 2026-02-09 | Early Features
- **Today Button**: Added navigation to current date from the calendar header. Fixed UI layout to prevent text clipping in the Vietnamese "Hôm nay" label.
- **Create Event from Modal**: Integrated a "Create Event" button in the `DayDetailModal`, pre-filling the lunar date for a smoother user experience.
- **Dual Calendar Display**: Implemented real-time solar date conversion in `EventForm` using `lunarToSolar` service.

## 2026-02-10 | Recurrence & UI
- **Event Creation Modes**: Introduced the distinction between "Single" and "Recurring" events. Updated `eventStore` and `CalendarView` to filter events by lunar year for one-time occurrences.
- **Custom Recurrence**: Replaced hardcoded yearly recurrence with a flexible system (Days, Weeks, Months, Years) supporting both Solar and Lunar systems. Created `isEventOccurring` utility for mathematical date matching.
- **Header UI Fixes**: Improved calendar header spacing and added a `MonthYearPickerModal` for rapid navigation, replacing simple chevron-based swiping.

## Technical Decisions
- **Zustand Migration**: Used versioned persist storage in `eventStore.ts` to upgrade legacy data to the new recurrence schema.
- **Logic Isolation**: Moved recurrence checking math to `src/utils/recurrence.ts` to keep components clean and testable.
