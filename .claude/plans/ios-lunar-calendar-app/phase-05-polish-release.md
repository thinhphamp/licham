# Phase 5: Polish & Release

## Context Links
- [Main Plan](./plan.md)
- [Research Report](./reports/01-research-report.md)
- Previous: [Phase 4: Features](./phase-04-features.md)

---

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-02-05 |
| Description | Performance optimization, accessibility, assets, and App Store preparation |
| Priority | P2 (Important) |
| Status | in-progress |
| Effort | 12h |

---

## Key Insights

1. **VoiceOver**: iOS users expect full accessibility - announce lunar dates clearly
2. **Performance**: Calendar scrolling must be 60fps, especially with complex day cells
3. **App Store**: Requires screenshots, privacy policy, age rating
4. **TestFlight**: Use for beta testing before public release
5. **App Review**: Vietnamese calendar apps generally approved without issues

---

## Requirements

### Functional
- R5.1: App icon (1024x1024 and all sizes)
- R5.2: Splash screen (launch image)
- R5.3: VoiceOver support for all screens
- R5.4: Dark mode support
- R5.5: App Store screenshots (6.5" and 5.5")
- R5.11: iOS Home Screen Widget (current lunar date & giờ hoàng đạo)
- R5.12: Data Export/Import (JSON) for backup/reliability

### Non-Functional
- R5.6: 60fps scrolling on iPhone 8 or newer
- R5.7: Cold start < 2 seconds
- R5.8: Memory usage < 100MB typical
- R5.9: Offline-only (no network required)
- R5.10: iOS 14.0+ support

---

## Architecture

### Asset Requirements

```
assets/
├── icon.png                    # 1024x1024 app icon
├── adaptive-icon.png           # Android adaptive (if needed later)
├── splash.png                  # Splash screen
├── images/
│   ├── app-store/
│   │   ├── screenshot-1.png    # 6.5" display
│   │   ├── screenshot-2.png
│   │   ├── screenshot-3.png
│   │   └── preview.mp4         # Optional app preview
│   └── promotional/
│       └── banner.png          # App Store feature banner
└── sounds/
    └── notification.wav        # Custom notification sound
```

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| FPS (scroll) | 60 | React Native Perf Monitor |
| Cold Start | < 2s | Stopwatch from tap to interactive |
| Memory (idle) | < 50MB | Xcode Instruments |
| Memory (active) | < 100MB | Xcode Instruments |
| Bundle Size | < 30MB | .ipa file size |

---

## Related Code Files

### File: `app.json` (Final Configuration)
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
      "backgroundColor": "#D4382A"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourname.lichviet",
      "buildNumber": "1",
      "infoPlist": {
        "NSCalendarsUsageDescription": "Cho phép ứng dụng truy cập lịch để đồng bộ sự kiện",
        "UIBackgroundModes": ["fetch", "remote-notification"]
      },
      "config": {
        "usesNonExemptEncryption": false
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
    ],
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

### File: `eas.json`
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-asc-app-id",
        "appleTeamId": "YOUR_TEAM_ID"
      }
    }
  }
}
```

### File: `src/constants/theme.ts`
```typescript
import { useColorScheme } from 'react-native';

export const colors = {
  light: {
    primary: '#D4382A',
    secondary: '#C4982E',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#1A1A1A',
    textSecondary: '#666666',
    textMuted: '#888888',
    border: '#EEEEEE',
    lunar: '#888888',
    holiday: '#D4382A',
    auspicious: '#C4982E',
    today: '#D4382A',
    selected: '#FFF3F0',
  },
  dark: {
    primary: '#FF5A4D',
    secondary: '#E6B84D',
    background: '#1A1A1A',
    surface: '#2A2A2A',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    textMuted: '#888888',
    border: '#3A3A3A',
    lunar: '#888888',
    holiday: '#FF5A4D',
    auspicious: '#E6B84D',
    today: '#FF5A4D',
    selected: '#3A2020',
  },
};

export function useTheme() {
  const colorScheme = useColorScheme();
  return colors[colorScheme === 'dark' ? 'dark' : 'light'];
}
```

### File: `src/components/common/AccessibleText.tsx`
```tsx
import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface AccessibleTextProps extends TextProps {
  accessibilityLabel?: string;
  role?: 'header' | 'text' | 'button';
}

export function AccessibleText({
  children,
  accessibilityLabel,
  role = 'text',
  style,
  ...props
}: AccessibleTextProps) {
  return (
    <Text
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={role === 'header' ? 'header' : 'text'}
      style={[styles.base, style]}
      {...props}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    // Base accessible text styles
  },
});
```

### File: `src/hooks/usePerformanceMonitor.ts`
```tsx
import { useEffect, useRef } from 'react';
import { InteractionManager } from 'react-native';

export function usePerformanceMonitor(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;

    if (__DEV__) {
      const elapsed = Date.now() - startTime.current;
      if (elapsed > 16) {
        // More than one frame
        console.warn(
          `[Performance] ${componentName} render took ${elapsed}ms (render #${renderCount.current})`
        );
      }
    }

    startTime.current = Date.now();
  });

  // Defer non-critical work
  const deferWork = (work: () => void) => {
    InteractionManager.runAfterInteractions(work);
  };

  return { deferWork, renderCount: renderCount.current };
}
```

### File: `src/utils/accessibility.ts`
```typescript
/**
 * Generate accessibility label for lunar date
 */
export function getLunarDateAccessibilityLabel(
  solarDay: number,
  solarMonth: number,
  solarYear: number,
  lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  isLeapMonth: boolean,
  holiday?: string
): string {
  const solarStr = `Ngày ${solarDay} tháng ${solarMonth} năm ${solarYear}`;
  const lunarStr = `Âm lịch ngày ${lunarDay} tháng ${lunarMonth}${isLeapMonth ? ' nhuận' : ''} năm ${lunarYear}`;
  const holidayStr = holiday ? `, ${holiday}` : '';

  return `${solarStr}, ${lunarStr}${holidayStr}`;
}

/**
 * Generate accessibility label for auspicious hour
 */
export function getHourAccessibilityLabel(
  hourName: string,
  startTime: string,
  endTime: string,
  isAuspicious: boolean,
  star?: string
): string {
  const timeStr = `từ ${startTime} đến ${endTime}`;
  const statusStr = isAuspicious ? 'giờ hoàng đạo' : 'giờ hắc đạo';
  const starStr = star ? `, sao ${star}` : '';

  return `Giờ ${hourName}, ${timeStr}, ${statusStr}${starStr}`;
}
```

### File: Privacy Policy (Required for App Store)
```markdown
# Chính sách bảo mật - Lịch Việt

## Thông tin chúng tôi thu thập
Ứng dụng Lịch Việt **KHÔNG** thu thập bất kỳ thông tin cá nhân nào. Tất cả dữ liệu (sự kiện, cài đặt) được lưu trữ cục bộ trên thiết bị của bạn.

## Quyền truy cập
- **Thông báo**: Để gửi nhắc nhở về sự kiện bạn tạo.
- Ứng dụng không yêu cầu bất kỳ quyền truy cập nào khác.

## Chia sẻ dữ liệu
Chúng tôi không chia sẻ dữ liệu với bất kỳ bên thứ ba nào vì không có dữ liệu nào được thu thập.

## Liên hệ
Nếu có câu hỏi về chính sách bảo mật, vui lòng liên hệ: your-email@example.com

Cập nhật lần cuối: 2026-02-05
```

---

## Implementation Steps

### Step 1: Create App Icon (2h)
Design 1024x1024 app icon:
- Red/gold theme matching Vietnamese culture
- Calendar/moon imagery
- Clear at small sizes

```bash
# Use icon generator or design tool
# Export all required sizes
npx expo-optimize
```

### Step 2: Create Splash Screen (1h)
- Simple, fast-loading splash
- Match app icon theme
- Consider launch animation (optional)

### Step 3: Implement Dark Mode (2h)
- Create theme hook
- Update all components to use theme colors
- Test on iOS dark mode

### Step 4: Add Accessibility (2h)
- VoiceOver labels for all interactive elements
- Semantic headers
- Dynamic type support
- Test with VoiceOver

### Step 5: Performance Optimization (2h)
- Profile with React DevTools
- Memo expensive components
- Optimize re-renders
- Test on older devices

```bash
# Profile performance
npx react-devtools

# In app:
# Enable Performance Monitor (shake -> "Toggle Performance Monitor")
```

### Step 6: Prepare App Store Assets (1h)
- Take screenshots on simulator
- Write Vietnamese description
- Prepare keywords
- Create privacy policy

### Step 10: Implement iOS Home Screen Widget (4h)
- Create Expo Config Plugin for Widget extension
- Build Swift UI widget for today's lunar date
- Implement data sharing between App and Widget
- Test on physical device

### Step 11: Implement Data Export/Import (2h)
- Create JSON export functionality (Share sheet)
- Implement JSON file picker for import
- Add "Backup & Restore" section in Settings

### Step 7: Build for TestFlight (1h)
```bash
# Login to EAS
eas login

# Build for iOS
eas build --platform ios --profile preview

# Submit to TestFlight
eas submit --platform ios
```

### Step 8: Beta Testing (Ongoing)
- Distribute to testers via TestFlight
- Collect feedback
- Fix critical issues

### Step 9: App Store Submission (1h)
```bash
# Production build
eas build --platform ios --profile production

# Submit for review
eas submit --platform ios --profile production
```

---

## Todo List

### Assets
- [ ] Design app icon (1024x1024)
- [ ] Export all icon sizes
- [ ] Create splash screen
- [ ] Record/create app preview video (optional)
- [ ] Take App Store screenshots (6.5")
- [ ] Take App Store screenshots (5.5")

### Dark Mode
- [ ] Create theme constants
- [ ] Create useTheme hook
- [ ] Update CalendarView for dark mode
- [ ] Update DayCell for dark mode
- [ ] Update DayDetailModal for dark mode
- [ ] Update EventForm for dark mode
- [ ] Update EventList for dark mode
- [ ] Update Settings for dark mode
- [ ] Test dark mode transition

### Accessibility
- [ ] Add accessibilityLabel to DayCell
- [ ] Add accessibilityLabel to EventCard
- [ ] Add accessibilityRole to buttons
- [ ] Add accessibilityHint where helpful
- [ ] Test with VoiceOver
- [ ] Support Dynamic Type

### Performance
- [ ] Profile calendar scrolling
- [ ] Memo DayCell component
- [ ] Optimize marked dates calculation
- [ ] Profile event list
- [ ] Test on iPhone 8/SE
- [ ] Measure cold start time
- [ ] Measure memory usage

### App Store
- [ ] Write Vietnamese app description
- [ ] Write keywords
- [ ] Create privacy policy
- [ ] Set age rating (4+)
- [ ] Configure App Store Connect
- [ ] Upload screenshots
- [ ] Submit for review

### Release
- [ ] Create eas.json configuration
- [ ] Build development client
- [ ] Test on real device
- [ ] Build preview for TestFlight
- [ ] Distribute to beta testers
- [ ] Fix beta feedback
- [ ] Build production
- [ ] Submit to App Store

---

## Success Criteria

- [ ] App icon looks good at all sizes
- [ ] Splash screen displays correctly
- [ ] Dark mode works throughout app
- [ ] VoiceOver reads all content correctly
- [ ] 60fps scrolling on calendar
- [ ] Cold start < 2 seconds
- [ ] TestFlight build works
- [ ] App Store screenshots ready
- [ ] Privacy policy published
- [ ] App submitted for review

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| App Store rejection | High | Low | Follow guidelines, test thoroughly |
| Performance issues on old devices | Medium | Medium | Test on iPhone 8 |
| Accessibility complaints | Medium | Low | Thorough VoiceOver testing |
| Icon/asset quality | Low | Low | Professional design review |

---

## Security Considerations

- Privacy policy accurately reflects no data collection
- No analytics or tracking implemented
- Encryption flag set correctly (false for no encryption)
- No sensitive data in logs

---

## App Store Listing

### App Name
Lịch Việt - Âm Lịch

### Subtitle
Lịch âm dương, giờ hoàng đạo

### Keywords
lịch âm, lịch việt, lunar calendar, giờ hoàng đạo, ngày giỗ, tết, vietnamese calendar

### Description (Vietnamese)
```
Lịch Việt - Ứng dụng lịch âm dương Việt Nam

TÍNH NĂNG CHÍNH:
• Xem lịch dương và lịch âm song song
• Tra cứu giờ hoàng đạo mỗi ngày
• Quản lý ngày giỗ ông bà
• Nhắc nhở sự kiện theo lịch âm
• Hiển thị các ngày lễ Việt Nam

HOÀN TOÀN MIỄN PHÍ - KHÔNG QUẢNG CÁO

Ứng dụng hoạt động offline, không cần kết nối mạng.
```

### Category
- Primary: Utilities
- Secondary: Lifestyle

### Age Rating
4+ (No objectionable content)

---

## Post-Release

After App Store approval:
1. Monitor App Store Connect for crash reports
2. Respond to user reviews
3. Plan version 1.1 with user feedback
4. Consider Android release

---

## Complete Project Summary

### Total Estimated Effort: 80 hours

| Phase | Hours | Status |
|-------|-------|--------|
| Phase 1: Project Setup | 8h | pending |
| Phase 2: Lunar Calendar Core | 20h | pending |
| Phase 3: Calendar UI | 16h | pending |
| Phase 4: Features | 24h | pending |
| Phase 5: Polish & Release | 12h | pending |

### Key Deliverables
1. iOS app with lunar/solar calendar
2. Vietnamese holidays display
3. Giờ hoàng đạo calculation
4. Ngày giỗ event management
5. Local notification reminders
6. App Store listing

### Tech Stack Summary
- React Native + Expo
- TypeScript
- Expo Router (navigation)
- Zustand + MMKV (state/storage)
- react-native-calendars (UI)
- expo-notifications (reminders)
