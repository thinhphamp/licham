---
title: "Vietnamese Lunar Calendar iOS App"
description: "React Native app with lunar/solar calendar, holidays, auspicious hours, and reminders"
status: in-progress
priority: P2
effort: 80h
branch: main
tags: [react-native, ios, lunar-calendar, vietnamese]
created: 2026-02-05
---

# Vietnamese Lunar Calendar iOS App - Implementation Plan

## Executive Summary

Build an offline-first iOS calendar app using React Native (Expo) that displays Vietnamese lunar and solar calendars side by side, shows traditional holidays and ancestor memorial days (ngày giỗ), provides auspicious hours (giờ hoàng đạo), and sends reminders based on lunar dates.

## Project Overview

| Aspect | Details |
|--------|---------|
| Platform | iOS (React Native + Expo) |
| Architecture | Offline-first, no backend |
| Duration | ~80 hours (~10 days full-time) |
| Priority | P2 (Medium) |

## Key Features

1. **Dual Calendar View** - Solar/Lunar dates displayed together
2. **Vietnamese Holidays** - Tết, Giỗ Tổ Hùng Vương, Trung Thu, etc.
3. **Ancestor Memorial Days** - User-defined ngày giỗ
4. **Auspicious Hours** - Giờ hoàng đạo for each day
5. **Event Reminders** - Local notifications based on lunar dates
6. **Home Screen Widget** - Quick view of today's lunar date
7. **Data Portability** - Export/Import JSON for backup

## Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Framework | React Native + Expo | Cross-platform, managed workflow |
| Language | TypeScript | Type safety |
| Navigation | Expo Router | File-based, automatic deep linking |
| State | Zustand | Lightweight, persist middleware |
| Storage | react-native-mmkv | 30x faster than AsyncStorage |
| Calendar UI | react-native-calendars | Mature, customizable |
| Notifications | expo-notifications | Native iOS integration |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Calendar   │  │   Events    │  │  Settings   │     │
│  │    View     │  │    List     │  │    View     │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────┐
│                   Business Layer                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Lunar     │  │   Events    │  │Notifications│     │
│  │  Service    │  │   Store     │  │   Service   │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────┐
│                    Data Layer                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │                  MMKV Storage                    │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────────┐  │   │
│  │  │Settings │  │ Events  │  │ Holidays Cache  │  │   │
│  │  └─────────┘  └─────────┘  └─────────────────┘  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Folder Structure

```
src/
├── app/                          # Expo Router pages
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab bar layout
│   │   ├── index.tsx            # Calendar (home)
│   │   ├── events.tsx           # Events list
│   │   └── settings.tsx         # Settings
│   ├── event/
│   │   ├── [id].tsx             # Event detail
│   │   └── new.tsx              # Create event
│   ├── day/[date].tsx           # Day detail view
│   └── _layout.tsx              # Root layout
├── components/
│   ├── calendar/
│   │   ├── CalendarView.tsx
│   │   ├── DayCell.tsx          # Custom day with lunar date
│   │   ├── LunarDateDisplay.tsx
│   │   └── AuspiciousHours.tsx
│   ├── events/
│   │   ├── EventCard.tsx
│   │   ├── EventList.tsx
│   │   └── EventForm.tsx
│   └── common/
│       ├── Header.tsx
│       ├── Button.tsx
│       └── Modal.tsx
├── hooks/
│   ├── useLunarDate.ts
│   ├── useAuspiciousHours.ts
│   └── useEvents.ts
├── services/
│   ├── lunar/
│   │   ├── index.ts             # Main lunar service
│   │   ├── converter.ts         # Solar <-> Lunar conversion
│   │   ├── canChi.ts            # Heavenly stems/branches
│   │   └── auspiciousHours.ts   # Giờ hoàng đạo calculation
│   └── notifications/
│       ├── index.ts
│       └── scheduler.ts
├── stores/
│   ├── eventStore.ts            # Zustand store for events
│   ├── settingsStore.ts         # App settings
│   └── storage.ts               # MMKV configuration
├── types/
│   ├── lunar.ts
│   ├── event.ts
│   └── common.ts
├── constants/
│   ├── holidays.ts              # Vietnamese holidays data
│   ├── canChi.ts                # Can Chi lookup tables
│   └── theme.ts
└── utils/
    ├── date.ts
    └── format.ts
```

## Implementation Phases

### Phase 1: Project Setup (8h)
- Initialize Expo project with TypeScript
- Configure ESLint, Prettier
- Set up navigation structure
- Configure MMKV storage
- Create base component library

### Phase 2: Lunar Calendar Core (20h)
- Port/implement lunar conversion algorithm
- Implement Can Chi calculation
- Build giờ hoàng đạo calculation
- Create Vietnamese holidays data
- Write comprehensive tests

### Phase 3: Calendar UI (16h)
- Integrate react-native-calendars
- Build custom DayCell with lunar dates
- Implement day detail view
- Add auspicious hours display
- Style for iOS

### Phase 4: Features (24h)
- Build event CRUD (ngày giỗ)
- Implement local notifications
- Add reminder scheduling
- Create settings screen
- Handle recurring lunar events

### Phase 5: Polish & Release (12h)
- Performance optimization
- Accessibility (VoiceOver)
- App icon and splash screen
- TestFlight deployment
- Documentation

## Success Criteria

- [ ] Accurate lunar date conversion (anchored to GMT+7)
- [ ] All Vietnamese holidays displayed correctly
- [ ] Giờ hoàng đạo matches traditional calculations
- [ ] Events persist across app restarts
- [ ] Notifications fire at correct times (under 64 limit)
- [ ] Data can be exported and imported correctly
- [ ] Home screen widget shows current date
- [ ] Smooth 60fps scrolling
- [ ] Works offline completely
- [ ] iOS 14+ support

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Lunar algorithm errors | High | Medium | Validate against multiple sources |
| Notification timing issues | Medium | Medium | Test across time zones |
| Performance with many events | Low | Low | Optimize list rendering |
| iOS permission rejection | Medium | Low | Follow Apple guidelines |

## Phase Links

- | 1 | Phase 1: Project Setup | Completed | 8h | [phase-01](./phase-01-project-setup.md) |
- | 2 | Phase 2: Lunar Calendar Core | Completed | 20h | [phase-02](./phase-02-lunar-calendar-core.md) |
- | 3 | Phase 3: Calendar UI | Completed | 16h | [phase-03](./phase-03-calendar-ui.md) |
- | 4 | Phase 4: Features | Completed | 24h | [phase-04](./phase-04-features.md) |
- | 5 | Phase 5: Polish & Release | In Progress | 12h | [phase-05](./phase-05-polish-release.md) |

## Reports

- [Research Report](./reports/01-research-report.md)
