## [1.2.0] - 2026-02-12

### Added
- **Performance Optimization**: Optimized calendar rendering with `CalendarDay` memo component and month-level `eventsMap` pre-calculation (reducing check complexity from O(N) to O(1) per day cell).
- **Unit Testing**: Integrated Vitest with 100% coverage for core lunar conversion algorithms.
- **Data Validation**: Integrated Zod for runtime type safety in event forms and state management.

### Documentation
- Updated `system-architecture.md`, `codebase-summary.md`, and `code-standards.md` to reflect new architecture layers and testing standards.

