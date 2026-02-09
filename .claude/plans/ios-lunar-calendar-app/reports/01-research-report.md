# Research Report: Vietnamese Lunar Calendar iOS App

**Date:** 2026-02-05
**Purpose:** Technical research for React Native Vietnamese Lunar Calendar app

---

## 1. Vietnamese Lunar Calendar Algorithm

### Core Algorithm Source
Based on research from [Ho Ngoc Duc's Vietnamese lunar calendar](https://www.xemamlich.uhm.vn/vncal_en.html) and the book "Calendrical Calculations" by Reingold & Dershowitz.

### Key Calculation Rules

1. **New Moon Determination**: First day of lunar month contains the New Moon
2. **Time Zone**: Vietnam uses GMT+7 (105° East meridian) - critical for accuracy
3. **Winter Solstice**: Must always fall in month 11
4. **Leap Month**: In years with 13 lunar months between Winter Solstices, first month after first Winter Solstice without a Principal Term is the leap month
5. **Principal Terms**: 12 points dividing the ecliptic into equal sectors

### Vietnamese vs Chinese Calendar Differences
- Different zodiac animals (Cat vs Rabbit in Vietnamese)
- Time zone affects month boundaries (New Moon at 16:24:45 GMT = 23:24:45 Hanoi time)
- Modern rules unified in 1976 after reunification

### Available JavaScript Libraries

| Library | Date Range | Features | Notes |
|---------|------------|----------|-------|
| [lunar-date (NghiaCaNgao)](https://github.com/NghiaCaNgao/LunarDate) | 1200-2199 | Conversion, Can Chi, Giờ Hoàng Đạo | Best option - native JS |
| [vnlunar (Dart)](https://github.com/nguyen703/vnlunar) | 1800-2199 | Conversion only | Dart/Flutter, not RN |
| [SolarLunarCalendar (Python)](https://github.com/quangvinh86/SolarLunarCalendar) | N/A | Full conversion, zodiac | Reference only |

**Recommended**: Port/adapt lunar-date library for React Native - provides all needed features including giờ hoàng đạo.

---

## 2. Giờ Hoàng Đạo (Auspicious Hours) Algorithm

### Structure
- Day divided into 12 two-hour periods (Tý to Hợi)
- 6 auspicious hours + 6 inauspicious hours per day
- Based on Earthly Branch (Chi) of the day

### The 12 Vietnamese Zodiac Hours

| Hour | Time | Name |
|------|------|------|
| Tý | 23:00-01:00 | Rat |
| Sửu | 01:00-03:00 | Buffalo |
| Dần | 03:00-05:00 | Tiger |
| Mão | 05:00-07:00 | Cat |
| Thìn | 07:00-09:00 | Dragon |
| Tỵ | 09:00-11:00 | Snake |
| Ngọ | 11:00-13:00 | Horse |
| Mùi | 13:00-15:00 | Goat |
| Thân | 15:00-17:00 | Monkey |
| Dậu | 17:00-19:00 | Rooster |
| Tuất | 19:00-21:00 | Dog |
| Hợi | 21:00-23:00 | Pig |

### The Six Auspicious Stars
1. **Thanh Long** - Most auspicious
2. **Kim Quỹ** - Good for childbirth
3. **Kim Đường**
4. **Ngọc Đường** - Good for career
5. **Minh Đường**
6. **Tư Mệnh**

### Calculation Method
Based on Lục Bát poetry lookup - each lunar day's Chi determines which hours are auspicious. Characters starting with "Đ" in the verse indicate giờ hoàng đạo.

---

## 3. Vietnamese Holidays Data

### National Holidays (Lunar Calendar)

| Holiday | Lunar Date | Description |
|---------|-----------|-------------|
| Tết Nguyên Đán | 1st day, 1st month | Lunar New Year (main holiday) |
| Giỗ Tổ Hùng Vương | 10th day, 3rd month | Hung Kings Commemoration |
| Tết Thanh Minh | 3rd day, 3rd month | Tomb Sweeping Day |
| Tết Đoan Ngọ | 5th day, 5th month | Mid-year festival |
| Lễ Vu Lan | 15th day, 7th month | Ghost Festival/Ancestors |
| Tết Trung Thu | 15th day, 8th month | Mid-Autumn Festival |
| Ông Công Ông Táo | 23rd day, 12th month | Kitchen Gods Day |

### Recurring Observances
- **Rằm (Full Moon)**: 15th of each lunar month
- **Mùng Một**: 1st of each lunar month
- **Ngày Giỗ**: Individual family ancestor memorial days (user-defined)

### 2026 Key Dates
- Tết 2026: February 17 (Year of the Horse)
- Official holiday: February 14-22, 2026

---

## 4. React Native Calendar Libraries Comparison

### Option A: react-native-calendars (Wix)
- **Score**: 81.4 (Context7)
- **Pros**: Mature, well-documented, agenda view, custom day rendering
- **Cons**: Less flexible for complex layouts
- **Best for**: Traditional calendar with marked dates

### Option B: react-native-calendar-kit (howljs)
- **Score**: 89.2 (Context7)
- **Pros**: Multi-view (day/week/month), zoom, localization built-in, Vietnamese locale support
- **Cons**: More complex setup
- **Best for**: Timeline views, event scheduling

### Option C: flash-calendar (marceloprado)
- **Score**: 75.9 (Context7)
- **Pros**: Performance optimized, lightweight
- **Cons**: Less features
- **Best for**: Simple calendar display

**Recommendation**: Use **react-native-calendars** for main calendar view + custom day component for lunar date display. Provides best balance of features and customization.

---

## 5. State Management & Storage

### State Management: Zustand
- Lightweight, minimal boilerplate
- Built-in persist middleware
- Works with MMKV or AsyncStorage
- TypeScript friendly

```typescript
// Example Zustand store with MMKV persistence
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV()
const mmkvStorage = {
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => storage.set(name, value),
  removeItem: (name) => storage.delete(name),
}
```

### Storage: MMKV vs AsyncStorage

| Feature | MMKV | AsyncStorage |
|---------|------|--------------|
| Speed | ~30x faster | Baseline |
| Sync API | Yes | No (async only) |
| Encryption | Built-in | No |
| Setup | Extra dependency | Built-in |

**Recommendation**: Use **react-native-mmkv** for better performance and synchronous access.

---

## 6. Navigation

### Expo Router vs React Navigation

| Feature | Expo Router | React Navigation |
|---------|-------------|------------------|
| Setup | File-based (automatic) | Manual configuration |
| Deep Linking | Automatic | Manual |
| TypeScript | Built-in | Manual setup |
| Learning Curve | Lower | Higher |

**Recommendation**: Use **Expo Router** (built on React Navigation). New Expo projects include it by default. Provides file-based routing, automatic deep linking, and TypeScript support.

---

## 7. Local Notifications

### Options

1. **expo-notifications** (Expo managed)
   - Easy setup
   - Scheduling support (daily, calendar)
   - Works with Expo Go

2. **notifee** (Bare React Native)
   - More powerful
   - Complex scheduling
   - Requires bare workflow

**Recommendation**: Use **expo-notifications** - sufficient for lunar calendar reminders, easier integration.

### Lunar Calendar Reminder Strategy
1. Convert lunar date to solar date
2. Schedule notification for calculated solar date
3. Handle repeating reminders by recalculating each year

---

## 8. Project Architecture Recommendation

### Folder Structure
```
src/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Calendar view
│   │   ├── events.tsx     # Events list
│   │   └── settings.tsx   # Settings
│   ├── event/[id].tsx     # Event detail
│   └── _layout.tsx        # Root layout
├── components/
│   ├── calendar/          # Calendar components
│   ├── common/            # Shared components
│   └── events/            # Event components
├── hooks/                 # Custom hooks
├── services/
│   ├── lunar/             # Lunar calendar logic
│   └── notifications/     # Notification service
├── stores/                # Zustand stores
├── types/                 # TypeScript types
├── utils/                 # Utility functions
└── constants/             # App constants (holidays data)
```

### Tech Stack Summary
- **Framework**: React Native + Expo (managed workflow)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State**: Zustand + persist middleware
- **Storage**: react-native-mmkv
- **Calendar UI**: react-native-calendars
- **Notifications**: expo-notifications
- **Lunar Logic**: Custom port of lunar-date library

---

## 9. Open Questions

1. **Lunar algorithm precision**: Need to validate algorithm accuracy for edge cases (leap months, century boundaries)
2. **Giờ hoàng đạo lookup table**: Need to extract/verify complete mapping from source
3. **Offline-first sync**: If future backend needed, consider WatermelonDB instead of MMKV
4. **iOS calendar integration**: Should we sync with native iOS Calendar app?

---

## References

- [Ho Ngoc Duc's Vietnamese Lunar Calendar](https://www.xemamlich.uhm.vn/vncal_en.html)
- [lunar-date JS Library](https://github.com/NghiaCaNgao/LunarDate)
- [react-native-calendars](https://wix.github.io/react-native-calendars/)
- [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)
- [Zustand Persist](https://zustand.docs.pmnd.rs/integrations/persisting-store-data)
- [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Vietnamese Public Holidays](https://www.timeanddate.com/holidays/vietnam/2026)
