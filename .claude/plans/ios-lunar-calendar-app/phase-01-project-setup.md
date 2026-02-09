# Phase 1: Project Setup

## Context Links
- [Main Plan](./plan.md)
- [Research Report](./reports/01-research-report.md)
- Next: [Phase 2: Lunar Calendar Core](./phase-02-lunar-calendar-core.md)

---

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-02-05 |
| Description | Initialize Expo project with core dependencies and architecture |
| Priority | P1 (Critical Path) |
| Status | completed |
| Effort | 8h |

---

## Key Insights

1. Expo managed workflow provides fastest path to iOS deployment
2. MMKV requires native module setup but offers significant performance gains
3. File-based routing with Expo Router simplifies navigation
4. TypeScript strict mode catches lunar date calculation bugs early

---

## Requirements

### Functional
- R1.1: Create new Expo project with TypeScript template
- R1.2: Configure file-based navigation with tabs
- R1.3: Set up persistent storage with MMKV
- R1.4: Initialize Zustand stores with persist middleware

### Non-Functional
- R1.5: ESLint + Prettier for code consistency
- R1.6: Path aliases for clean imports
- R1.7: iOS minimum version: 14.0

---

## Architecture

### Dependencies

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-notifications": "~0.29.0",
    "react-native-calendars": "^1.1306.0",
    "react-native-mmkv": "^3.0.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "~5.3.0",
    "@types/react": "~18.2.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

### Configuration Files

```
project-root/
├── app.json                 # Expo config
├── tsconfig.json           # TypeScript config
├── babel.config.js         # Babel with path aliases
├── .eslintrc.js            # ESLint rules
├── .prettierrc             # Prettier config
└── eas.json                # EAS Build config
```

---

## Related Code Files

### File: `app.json`
```json
{
  "expo": {
    "name": "Lịch Việt",
    "slug": "lich-viet",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "lichviet",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourname.lichviet",
      "infoPlist": {
        "UIBackgroundModes": ["fetch", "remote-notification"]
      }
    },
    "plugins": [
      "expo-router",
      [
        "expo-notifications",
        {
          "sounds": ["./assets/sounds/notification.wav"]
        }
      ]
    ]
  }
}
```

### File: `src/app/_layout.tsx`
```tsx
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initializeStorage } from '@/stores/storage';

export default function RootLayout() {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="event/[id]" options={{ presentation: 'modal' }} />
      <Stack.Screen name="day/[date]" options={{ presentation: 'card' }} />
    </Stack>
  );
}
```

### File: `src/app/(tabs)/_layout.tsx`
```tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#D4382A',
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Lịch',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Sự kiện',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Cài đặt',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

### File: `src/stores/storage.ts`
```tsx
import { MMKV } from 'react-native-mmkv';
import { StateStorage } from 'zustand/middleware';

export const storage = new MMKV({
  id: 'lich-viet-storage',
  encryptionKey: 'optional-encryption-key',
});

export const mmkvStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string): void => {
    storage.set(name, value);
  },
  removeItem: (name: string): void => {
    storage.delete(name);
  },
};

export function initializeStorage(): void {
  // Migration logic if needed
  const version = storage.getNumber('version') ?? 0;
  if (version < 1) {
    // Initial setup
    storage.set('version', 1);
  }
}
```

### File: `src/stores/settingsStore.ts`
```tsx
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './storage';

interface SettingsState {
  showLunarDates: boolean;
  showAuspiciousHours: boolean;
  reminderDaysBefore: number;
  reminderTime: string; // "HH:mm"

  setShowLunarDates: (show: boolean) => void;
  setShowAuspiciousHours: (show: boolean) => void;
  setReminderDaysBefore: (days: number) => void;
  setReminderTime: (time: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      showLunarDates: true,
      showAuspiciousHours: true,
      reminderDaysBefore: 1,
      reminderTime: '08:00',

      setShowLunarDates: (show) => set({ showLunarDates: show }),
      setShowAuspiciousHours: (show) => set({ showAuspiciousHours: show }),
      setReminderDaysBefore: (days) => set({ reminderDaysBefore: days }),
      setReminderTime: (time) => set({ reminderTime: time }),
    }),
    {
      name: 'settings',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
```

### File: `tsconfig.json`
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

---

## Implementation Steps

### Step 1: Create Expo Project (30 min)
```bash
# Create new Expo project
npx create-expo-app@latest lich-viet --template tabs

# Navigate to project
cd lich-viet

# Remove default content, restructure to src/
```

### Step 2: Install Dependencies (30 min)
```bash
# Core dependencies
npx expo install react-native-mmkv zustand

# Calendar
npm install react-native-calendars

# Notifications
npx expo install expo-notifications

# Dev dependencies
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier
```

### Step 3: Configure MMKV Native Module (1h)
```bash
# For iOS, MMKV requires native build
npx expo prebuild --platform ios

# Install pods
cd ios && pod install && cd ..
```

### Step 4: Set Up Folder Structure (30 min)
Create the directory structure as defined in the main plan.

### Step 5: Configure TypeScript Path Aliases (30 min)
Update `tsconfig.json` and `babel.config.js` for `@/` imports.

### Step 6: Create Storage Layer (1h)
Implement MMKV storage wrapper and Zustand stores.

### Step 7: Set Up Navigation (1h)
Create tab layout and placeholder screens.

### Step 8: Configure ESLint/Prettier (30 min)
Set up linting rules for consistent code style.

### Step 9: Create Base Components (2h)
Build common components: Button, Header, Modal, etc.

### Step 10: Verify Build (1h)
```bash
# Run on iOS simulator
npx expo run:ios

# Verify storage works
# Verify navigation works
```

---

## Todo List

- [x] Create Expo project with TypeScript
- [x] Restructure to src/ folder
- [x] Install all dependencies
- [x] Configure MMKV with native build
- [x] Set up TypeScript path aliases
- [x] Create MMKV storage wrapper
- [x] Create Zustand settings store
- [x] Implement tab navigation
- [x] Create placeholder screens (index, events, settings)
- [x] Configure ESLint and Prettier
- [x] Build common Button component
- [x] Build common Header component
- [x] Build common Modal component
- [x] Test iOS simulator build
- [x] Verify storage persistence

---

## Success Criteria

- [ ] `npx expo run:ios` builds and runs without errors
- [ ] Tab navigation works between 3 screens
- [ ] MMKV storage persists data across app restarts
- [ ] Zustand store rehydrates on app launch
- [ ] TypeScript compiles with no errors
- [ ] ESLint passes with no warnings
- [ ] Path aliases resolve correctly

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| MMKV native build fails | High | Low | Fallback to AsyncStorage initially |
| Expo SDK version conflicts | Medium | Medium | Lock dependency versions |
| Path alias issues | Low | Medium | Test early, fix babel config |

---

## Security Considerations

- MMKV encryption key should be stored securely (Keychain) for production
- No sensitive data in this phase, but foundation supports encryption
- Bundle identifier must be unique for App Store

---

## Next Steps

After completing Phase 1:
1. Verify all success criteria
2. Commit with message: "Phase 1: Project setup complete"
3. Proceed to [Phase 2: Lunar Calendar Core](./phase-02-lunar-calendar-core.md)
