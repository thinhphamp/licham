# Lịch Việt - Project Overview & Product Development Requirements

## Project Vision

Lịch Việt (Vietnamese Lunar Calendar) is a comprehensive digital solution designed to preserve and modernize Vietnamese lunar calendar traditions. The app serves the global Vietnamese diaspora and cultural practitioners who maintain traditional customs tied to the lunar calendar. By making accurate lunar date calculations, auspicious hour lookups, and event management accessible on mobile devices, the project bridges the gap between ancient Vietnamese cultural wisdom and contemporary technology.

## Problem Statement

Vietnamese communities worldwide struggle to:
- Accurately convert between solar and lunar dates without physical almanacs
- Determine auspicious hours for ceremonies and important events
- Track Vietnamese holidays and observances on modern calendar systems
- Manage multiple events tied to lunar dates with timely reminders
- Preserve cultural knowledge for younger generations

## Solution Overview

Lịch Việt provides an all-in-one mobile application for lunar calendar management with:
- Offline-first architecture requiring no internet connection
- Accurate astronomical calculations following traditional Vietnamese methods
- Seamless cross-platform experience (iOS, Android, Web)
- Cultural-appropriate design reflecting Vietnamese heritage
- Zero data collection or external dependencies

## Core Features

### 1. Lunar Calendar with Bidirectional Conversion
- Accurate solar ↔ lunar date conversion using Meeus algorithm
- Handles leap months and traditional lunar calendar rules
- Real-time solar date display
- Historical date conversion capability
- Lunar month/day calculation with proper validation

### 2. Can-Chi 60-Year Cycle System
- Displays 10 Heavenly Stems (Thiên Gan): Giáp, Ất, Bính, Đinh, Mậu, Kỷ, Canh, Tân, Nhâm, Quý
- Displays 12 Earthly Branches (Địa Chi): Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi
- Associated zodiac animals (Chuột, Trâu, Hổ, Mèo, Rồng, Rắn, Ngựa, Dê, Khỉ, Gà, Chó, Lợn)
- Visual display with cultural colors
- Year and day cycle calculations

### 3. Auspicious Hours (Giờ Tốt)
- 12 traditional two-hour periods based on Chi system
- Daily lucky hours calculation based on lunar day
- Visual auspicious hours grid with color coding
- Quick reference for ceremony planning
- Customizable time display (24-hour or AM/PM)

### 4. Comprehensive Event Management
- Create events tied to lunar dates
- Event details: title, description, location, category
- Reminder configuration (days before, specific time)
- Event categories: holidays, ceremonies, birthdays, observances
- Recurring event support (planned)
- Event search and filtering

### 5. Vietnamese Holiday Tracking
- 13 major national holidays:
  - Tết Nguyên Đán (Lunar New Year)
  - Tết Tây (Western New Year)
  - Giỗ Tổ Hùng Vương (Hung Kings Festival)
  - Tết Đoan Ngọ (Dragon Boat Festival - 5th lunar month 5th day)
  - Tết Trung Thu (Mid-Autumn Festival)
  - Tết Kỵ (Lunar July 15th)
  - Tết Nguyên Tiêu (Lantern Festival)
  - National holidays: Independence Day, Reunification Day, etc.
- Monthly observances and minor holidays
- Holiday notifications and reminders
- Import/export holiday calendar

### 6. Smart Notification System
- Automatic scheduling based on lunar date conversion
- Customizable reminder times (days before, specific time)
- Notification delivery via expo-notifications
- Persistence of notification IDs for management
- Silent/vibrate mode support
- Timezone-aware scheduling (Vietnam GMT+7 as default)

### 7. Dark Mode & Cultural Theming
- Complete dark/light mode support
- Vietnamese cultural color palette:
  - Primary Red: #D4382A (representing Vietnamese flag)
  - Secondary Gold: #C4982E (representing prosperity and luck)
  - Complementary colors for accessibility
- Theme customization in settings
- Automatic theme detection based on system preference

### 8. Offline-First Architecture
- MMKV for fast local key-value storage
- Zustand with persist middleware for state management
- Zero cloud dependencies
- No account creation or login required
- All data remains on user's device

### 9. Data Management
- **Export**: Save all events as JSON file to device storage
- **Import**: Restore events from previously exported JSON files
- **Cloud Sync**: Planned iCloud/Google sync in Phase 2
- **Backup**: User can manually backup via export feature

## Target Users

### Primary Users
1. **Vietnamese Diaspora**: Vietnamese immigrants and descendants maintaining cultural traditions
2. **Festival & Ceremony Planners**: Organizing Vietnamese cultural events and ceremonies
3. **Religious Practitioners**: Buddhist temples, Taoist practitioners, traditional healers
4. **Cultural Educators**: Teaching Vietnamese heritage to younger generations

### Secondary Users
1. **Asian Calendar Enthusiasts**: Interest in traditional Eastern calendars
2. **Event Planners**: Need for comprehensive calendar management
3. **Researchers**: Academic study of Vietnamese cultural traditions

## Technical Requirements

### Platform Support
- **iOS**: Version 12.0+, arm64 architecture, 94 CocoaPods dependencies
- **Android**: API level 24+, multiple ABIs (armeabi-v7a, arm64-v8a, x86, x86_64)
- **Web**: Full responsive web support via Expo Web

### Architecture Requirements
- **Offline-First**: All core functionality works without internet
- **Fast Performance**: Lunar calculations under 100ms
- **Battery Efficient**: Minimal background processing
- **Storage Efficient**: SQLite or MMKV for compact storage

### Accessibility Requirements
- Vietnamese screen reader labels (TalkBack, VoiceOver)
- High contrast mode support
- Touch target sizes minimum 44x44 dp
- Proper semantic HTML for web
- WCAG 2.1 AA compliance

### Data Privacy
- No personal data collection
- No external API calls
- All data stored locally on device
- No analytics or telemetry
- Optional cloud sync (user controlled)

### User Experience
- Intuitive lunar/solar date navigation
- Fast date switching and event lookup
- Clear visual feedback for interactions
- Culturally appropriate iconography
- Multi-language support (Vietnamese, English planned)

## Non-Functional Requirements

### Performance
- App startup time: < 2 seconds
- Calendar view rendering: < 500ms
- Lunar conversion calculation: < 100ms
- Event filtering: < 50ms for 1000+ events
- Notification scheduling: < 200ms per event

### Reliability
- 99.9% uptime (no external dependencies)
- Data persistence across app restarts
- Notification delivery reliability: 99%
- Error handling with user-friendly messages

### Maintainability
- TypeScript strict mode enabled
- Comprehensive component testing
- Clear code comments for algorithm-heavy sections
- Documented API for lunar service
- Modular component architecture

### Security
- Input validation for all user entries
- No storage of sensitive credentials
- HTTPS for any future cloud features
- Optional encryption for stored data (planned)

## Success Metrics

### User Adoption
- Target: 5,000+ downloads in first 6 months
- Retention: 40%+ of users returning monthly
- App rating: 4.5+ stars on app stores

### Feature Usage
- 60%+ of users creating at least one event
- 40%+ of users checking auspicious hours
- 80%+ of users viewing holidays

### Performance Metrics
- Average session duration: 3-5 minutes
- Calendar view daily active users: 70%
- Notification delivery success: 99%+

### Quality Metrics
- Crash-free session rate: 99.5%+
- Unit test coverage: 80%+
- Lunar calculation accuracy: 100% against reference data

## Acceptance Criteria

### MVP (Phase 1) - COMPLETE
- ✅ Accurate lunar/solar conversion with algorithm tests
- ✅ Can-Chi cycle display with correct animal assignment
- ✅ Auspicious hours daily lookup table
- ✅ CRUD operations for events
- ✅ Notification scheduling and delivery
- ✅ 13+ Vietnamese holidays pre-loaded
- ✅ Dark/light theme toggle
- ✅ Data export/import functionality
- ✅ Offline-first with MMKV storage
- ✅ iOS and Android builds
- ✅ Web support
- ✅ Accessibility compliance

### Phase 2 Considerations
- Widget support for home screen quick access
- Apple Watch / WearOS companion app
- Cloud sync (iCloud/Google Drive)
- Recurring events
- Event reminders customization UI improvements

### Phase 3+ Future
- Multi-language support (Vietnamese, English, Cantonese)
- Predictive notifications for auspicious events
- Community holiday sharing
- Custom holiday calendar creation
- Integration with native calendar apps

## Constraints & Assumptions

### Technical Constraints
- Hermes engine compatibility (React Native requirement)
- New Architecture support for both platforms
- Expo EAS build system for app store submissions
- TypeScript strict mode enforcement

### Business Constraints
- Limited to free tier of Expo services initially
- Single-timezone support (Vietnam GMT+7) in Phase 1
- No server infrastructure required
- MIT license permissive for commercial use

### User Assumptions
- Users have basic smartphone literacy
- Familiarity with Vietnamese culture and traditions
- Occasional app usage (1-3 times per week on average)
- Willingness to manage local data backup

## Dependencies & Integration Points

### External Libraries (Key)
- **expo**: Base framework and platform integration
- **react-native-calendars**: UI for calendar display
- **zustand**: Lightweight state management
- **react-native-mmkv**: High-performance storage
- **expo-notifications**: Push notification scheduling
- **expo-document-picker**: File import for JSON events
- **expo-sharing**: File export for JSON backup

### Platform-Specific
- **iOS**: MetricKit for crash reporting, iOS Notifications
- **Android**: Firebase Cloud Messaging capability, Android Notifications
- **Web**: localStorage fallback, browser notifications

## Risk Assessment

### High Priority
- **Lunar algorithm accuracy**: Mitigated by using proven Meeus algorithm and validation against reference
- **Notification reliability**: Tested on both platforms, scheduled as local triggers
- **App store approval**: Straightforward content policy, no risky features

### Medium Priority
- **Performance with large datasets**: Pagination and memoization strategies
- **Cross-platform UI consistency**: Component testing across platforms
- **User data loss**: Export/backup features, persistent storage

### Low Priority
- **Localization challenges**: Start with Vietnamese/English, iterative expansion
- **Hardware incompatibilities**: Wide range of tested devices
- **API deprecation**: No external API dependencies currently

## Future Roadmap

### Phase 2 (Next 3 months)
- Widget support for iOS and Android
- WearOS/Apple Watch companion
- Cloud sync with iCloud/Google Drive
- Recurring event templates

### Phase 3 (6+ months)
- Multi-language support
- Advanced event filtering and search
- Event statistics and insights
- Community event calendar
- Integration with native calendar apps

### Phase 4+ (Long-term vision)
- AI-powered ceremony recommendations
- Extended family calendar sharing (encrypted)
- Push notifications via APNs for cross-device
- Custom lunar calendar themes
- Offline map integration for ceremony locations

## Success Definition

Lịch Việt will be considered successful when:
1. It accurately preserves Vietnamese lunar calendar traditions in digital form
2. Vietnamese diaspora communities adopt it for daily cultural practice
3. Features are stable with 99%+ crash-free session rate
4. Users value it enough to recommend to others (4.5+ star rating)
5. It requires minimal maintenance with automated testing in place
