# Changelog

All notable changes to Lịch Việt (Vietnamese Lunar Calendar) are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2026-02-12

### Added
- **Performance Optimization**: Optimized calendar rendering with `CalendarDay` memo component and month-level `eventsMap` pre-calculation (reducing check complexity from O(N) to O(1) per day cell).
- **Unit Testing**: Integrated Vitest with 100% coverage for core lunar conversion algorithms.
- **Data Validation**: Integrated Zod for runtime type safety in event forms and state management.
- Editable default reminder settings - users can now customize default notification timing.

### Fixed
- Calendar header layout improved for long month names (Vietnamese month names).
- Export/import data service now uses correct expo-file-system v18 API.
- Version display in settings now reads dynamically from app config.

### Documentation
- Updated `system-architecture.md`, `codebase-summary.md`, and `code-standards.md` to reflect new architecture layers and testing standards.
- Added build-xcode-altstore guide for manual builds.

## [1.1.0] - 2026-02-10

### Added
- Year selector grid in MonthYearPickerModal - easier navigation between years
- Create event button directly in day modal for faster event creation
- Solar date display in event form for reference when creating lunar-based events

## [1.0.0] - 2026-02-09

### Added
- **Lunar Calendar**: Accurate bidirectional solar ↔ lunar conversion using Meeus algorithm
- **Can-Chi System**: Traditional 60-year cycle with Heavenly Stems, Earthly Branches, and Zodiac animals
- **Auspicious Hours**: Traditional lucky hours lookup for each lunar day
- **Event Management**: Create events tied to lunar dates with smart notifications
- **Vietnamese Holidays**: 13 major national holidays plus monthly observances (Mùng 1, Rằm)
- **Smart Notifications**: Automatic reminders for events based on lunar dates
- **Dark Mode**: Complete dark mode support with Vietnamese cultural color theme
- **Offline-First**: All data stored locally with MMKV, no internet required
- **Data Sync**: Export/import events as JSON for multi-platform support

### Technical
- Built with Expo SDK 52, React Native 0.76.9, React 18.3.1
- Expo Router 4.0+ for file-based navigation
- Zustand 5.0 + MMKV 3.3 for state management
- TypeScript 5.8 in strict mode
- Platform support: iOS 12+, Android API 24+, Web

[1.1.1]: https://github.com/user/calendar-app/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/user/calendar-app/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/user/calendar-app/releases/tag/v1.0.0
