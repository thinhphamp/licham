# Lịch Việt - Vietnamese Lunar Calendar

A React Native app for tracking Vietnamese lunar dates, events, and auspicious hours. Built with Expo, designed for Vietnamese diaspora and cultural practitioners maintaining traditional lunar calendar customs.

## Features

- **Lunar Calendar**: Accurate bidirectional solar ↔ lunar conversion using Meeus algorithm
- **Can-Chi System**: Traditional 60-year cycle with Heavenly Stems, Earthly Branches, and Zodiac animals
- **Auspicious Hours**: Traditional lucky hours lookup for each lunar day
- **Event Management**: Create events tied to lunar dates with smart notifications
- **Vietnamese Holidays**: 13 major national holidays plus monthly observances
- **Smart Notifications**: Automatic reminders for events based on lunar dates
- **Dark Mode**: Complete dark mode support with Vietnamese cultural color theme
- **Offline-First**: All data stored locally with MMKV, no internet required
- **Data Sync**: Export/import events as JSON, multi-platform support

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on specific platform
npm run ios      # iOS simulator/device
npm run android  # Android emulator/device
npm run web      # Web browser
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | React 18.3.1, Expo 52, Vitest, Zod |
| Navigation | Expo Router 4.0+ |
| State Management | Zustand 5.0 + MMKV 3.3 |
| Language | TypeScript 5.8 (strict mode) |
| Calendar UI | react-native-calendars |
| Notifications | expo-notifications |
| Build | EAS (Expo Application Services) |

## Project Structure

```
src/
├── app/                # Expo Router pages (file-based routing)
│   ├── (tabs)/        # Tab navigation (Calendar, Events, Settings)
│   ├── event/         # Event management screens
│   ├── day/           # Day detail view
│   └── _layout.tsx    # Root layout initialization
├── components/         # UI components
│   ├── calendar/      # CalendarView, DayCell, DayDetailModal
│   ├── events/        # EventForm, EventList, EventCard
│   └── common/        # Button, Header, Modal, AccessibleText
├── services/           # Business logic & algorithms
│   ├── lunar/         # Converter, Can-Chi, auspicious hours
│   └── notifications/ # Expo Notifications wrapper
├── stores/             # Zustand state management
│   ├── eventStore.ts  # Events CRUD + notification sync
│   └── storage.ts     # MMKV + Zustand adapter
├── hooks/              # useLunarDate, useAuspiciousHours
├── constants/          # theme.ts, holidays.ts
├── types/              # TypeScript interfaces
└── utils/              # Pure utility functions
```

## Development Scripts

```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS
npm run android    # Run on Android
npm run web        # Run on web
npm run lint       # Check code with ESLint
npm run format     # Format code with Prettier
```

## Key Features Explained

### Lunar Conversion
Bidirectional conversion between solar and lunar dates using the Meeus algorithm for astronomical accuracy. The system handles leap months and special lunar calendar rules.

### Can-Chi System
Displays the traditional Vietnamese zodiac based on 10 Heavenly Stems and 12 Earthly Branches, creating a 60-year cycle with associated zodiac animals.

### Auspicious Hours
Provides daily lucky hours based on the lunar day's chi element. Useful for ceremony planning and traditional activities.

### Notifications
Events attached to lunar dates automatically convert to solar dates and schedule notifications with customizable reminder times.

## Documentation
- **[Build Xcode & Cài đặt AltStore](docs/build-xcode-altstore.md)** - Hướng dẫn build thủ công khi hết hạn Developer Program
- **[Project Overview & PDR](docs/project-overview-pdr.md)** - Vision, features, requirements
- **[Codebase Summary](docs/codebase-summary.md)** - Module breakdown and data flow
- **[Code Standards](docs/code-standards.md)** - Development guidelines and conventions
- **[System Architecture](docs/system-architecture.md)** - Technical architecture and algorithms
- **[Project Roadmap](docs/project-roadmap.md)** - Planned features and improvements

## Platform Support

- **iOS**: iOS 12+, arm64 architecture, 94 CocoaPods dependencies
- **Android**: API 24+, multiple architectures (armeabi-v7a, arm64-v8a, x86, x86_64)
- **Web**: Full web support via Expo Web, responsive design

## Getting Help

Refer to the documentation folder for detailed guides on:
- Setting up the development environment
- Understanding the lunar conversion algorithms
- Managing events and notifications
- Customizing the UI and theme

## License

MIT
