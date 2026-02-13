# Project Roadmap - Lịch Việt

Strategic roadmap for the Vietnamese Lunar Calendar application, outlining completed features, planned enhancements, and long-term vision.

## Phase 1: MVP (Completed)

### Release Target: 2026 Q1

All MVP features have been completed and are production-ready. The app provides complete core functionality for lunar calendar management with high reliability and performance.

#### Completed Features

**Lunar Calendar System**
- ✅ Accurate solar ↔ lunar date bidirectional conversion
- ✅ Julian Day Number algorithm implementation (Meeus)
- ✅ Leap month detection and handling
- ✅ Historical and future date support (1800-2100+)
- ✅ Calendar view with solar/lunar date overlay
- ✅ Month/year navigation with smooth transitions
- ✅ Day detail modal with comprehensive information
- ✅ Holiday highlighting and special date marking

**Can-Chi System**
- ✅ 10 Heavenly Stems (Thiên Gan) display
- ✅ 12 Earthly Branches (Địa Chi) display
- ✅ 12 Zodiac animals (Chuột, Trâu, Hổ, etc.)
- ✅ 60-year cycle calculations
- ✅ Year and day can-chi determination
- ✅ Cultural color theming (red, gold)

**Auspicious Hours**
- ✅ 12 chi hours daily lookup (Tý to Hợi)
- ✅ Luck level determination (very-good, neutral, bad)
- ✅ Color-coded visual grid (green, yellow, red)
- ✅ 24-hour format display
- ✅ Time zone handling (Vietnam GMT+7)

**Event Management**
- ✅ Create events tied to lunar dates
- ✅ Event properties: title, description, location, category
- ✅ Event categories: birthday, ceremony, holiday, observance, other
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Event listing with filtering by lunar month
- ✅ Event search and sorting capabilities
- ✅ Event details view with lunar date display

**Notification System**
- ✅ Automatic notification scheduling
- ✅ Lunar date conversion for reminders
- ✅ Customizable reminder offset (days before + time)
- ✅ Default reminder settings (1 day before, 8:00 AM)
- ✅ Notification persistence and retrieval
- ✅ Notification cancellation on event deletion
- ✅ iOS local notifications (UNUserNotificationCenter)
- ✅ Permission handling and request flow
- ✅ iOS notification reliability (listeners + tap handler)
- ✅ Internal notification debug system
- ✅ Default reminder setting (8:00 AM) with 15m intervals
- ✅ Event-specific reminders with 15m intervals config

**Vietnamese Holiday Support**
- ✅ 13 major national holidays pre-loaded:
  - Tết Nguyên Đán (Lunar New Year - 1/1)
  - Tết Tây (Western New Year - 1/1)
  - Giỗ Tổ Hùng Vương (Hung Kings - 3/10)
  - Tết Đoan Ngọ (Dragon Boat - 5/5)
  - Tết Trung Thu (Mid-Autumn - 8/15)
  - Tết Kỵ (Ghost Festival - 7/15)
  - Tết Nguyên Tiêu (Lantern - 1/15)
  - Independence Day (4/30)
  - Reunification Day (5/1)
  - Labor Day (5/1)
  - National Day (9/2)
  - National Foundation Day
  - And more observances
- ✅ Holiday calendar marking with visual indicators
- ✅ Holiday notifications integration

**User Interface**
- ✅ Tab-based navigation (Calendar, Events, Settings)
- ✅ Dark mode / Light mode toggle
- ✅ Vietnamese cultural color palette
  - Primary red: #D4382A (flag color)
  - Secondary gold: #C4982E (prosperity)
- ✅ Responsive design (iOS, Android, Web)
- ✅ Platform-specific styling (iOS UIKit, Android Material)
- ✅ Smooth animations and transitions
- ✅ Status bar integration
- ✅ Safe area handling

**Accessibility**
- ✅ Vietnamese screen reader labels
- ✅ WCAG 2.1 AA color contrast compliance
- ✅ 44x44 dp minimum touch targets
- ✅ Semantic HTML for web version
- ✅ VoiceOver support (iOS)
- ✅ TalkBack support (Android)
- ✅ Font scaling support
- ✅ High contrast mode support

**Data Management**
- ✅ MMKV storage integration (fast key-value store)
- ✅ Zustand state management with persistence
- ✅ Offline-first architecture
- ✅ Event data export as JSON
- ✅ Event data import from JSON files
- ✅ Expo Sharing integration for file exchange
- ✅ Manual backup capability
- ✅ Data restoration from backups

**Cross-Platform Support**
- ✅ iOS support (12.0+, arm64)
- ✅ Android support (API 24+, multiple ABIs)
- ✅ Web support (responsive browser)
- ✅ Expo Router file-based navigation
- ✅ EAS build system integration
- ✅ Platform-specific configurations
- ✅ Deep linking support

**Developer Experience**
- ✅ TypeScript strict mode enforcement
- ✅ Comprehensive code documentation
- ✅ Clear component organization
- ✅ Reusable component library
- ✅ Custom hooks for lunar calculations
- ✅ Service layer for business logic
- ✅ Consistent code standards
- ✅ ESLint and Prettier configuration

#### Phase 1 Success Metrics

- **Lunar Accuracy**: 100% against reference data (no deviations)
- **Performance**: App startup < 2 seconds, calendar render < 500ms
- **Reliability**: 99%+ crash-free session rate
- **Feature Completeness**: All MVP features functional and tested
- **Code Quality**: TypeScript strict mode, 80%+ test coverage (planned)

---

## Phase 2: Enhanced Features (3 months)

### Planned Release: 2026 Q2

Introducing cross-device synchronization, home screen widgets, and wearable support for improved accessibility and user experience.

#### Planned Features

**Widget Support**
- [ ] iOS Home Screen Widget (WidgetKit)
  - Show current lunar date at a glance
  - Quick event list for upcoming events
  - Auspicious hour indicator
  - Tap to open app for details
  - Automatic updates every 15 minutes
  - Light/dark mode support

- [ ] Android Home Screen Widget (AppWidgets)
  - Similar functionality to iOS
  - Customizable widget sizes (2x2, 4x4)
  - Tap actions for navigation
  - Battery-efficient updates
  - Configuration screen for display options

**Wearable Support**
- [ ] Apple Watch Companion
  - Minimal event list for today/tomorrow
  - Quick lunar date display
  - Auspicious hour lookup
  - Action buttons (mark as done, snooze)
  - Complication support (Circular, Gauge, Graphic)
  - Data sync with iPhone app

- [ ] WearOS Support
  - Similar to Apple Watch
  - Tile system integration
  - Health integration capability
  - Always-on display support
  - Offline operation for core features

**Cloud Synchronization**
- [ ] iCloud Integration (iOS/macOS)
  - Event sync across Apple devices
  - Automatic backup to iCloud
  - Conflict resolution (last write wins)
  - Selective sync toggle
  - iCloud Drive integration

- [ ] Google Drive Integration (Android/Web)
  - Event sync across Google devices
  - Automatic backup to Google Drive
  - Same conflict resolution
  - Selective sync capability
  - Web version support

**Advanced Features**
- [ ] Recurring Events
  - Daily/weekly/monthly/yearly patterns
  - Exception handling (skip specific occurrences)
  - Pattern editor UI
  - Notification generation for recurring events

- [ ] Event Reminders Enhancement
  - Multiple reminders per event
  - Reminder templates (1 day, 3 days, 1 week)
  - Custom times for reminders
  - Notification action buttons (Done, Snooze, More)

- [ ] Event Categorization
  - Custom categories beyond defaults
  - Color coding per category
  - Category-based filtering
  - Category statistics

**Performance Optimizations**
- ✅ Individual cell rendering with solar/lunar dates
- ✅ Dynamic styling for today, holidays, and events
- ✅ Memoized components for zero-lag scrolling
- ✅ Month-level event pre-calculation for O(1) rendering

#### Phase 2 Success Criteria

- Widget user engagement > 40%
- Wearable daily active users > 20% of main app
- Cloud sync success rate > 99.5%
- Zero data loss incidents
- Feature adoption > 60% of user base

---

## Phase 3: Localization & Community (6+ months)

### Planned Release: 2026 Q3

Expanding language support and introducing community features for global reach and cultural exchange.

#### Planned Features

**Multi-Language Support**
- [ ] English translation (complete UI)
- [ ] Simplified Chinese (for pan-Asian communities)
- [ ] Traditional Chinese (Hong Kong, Taiwan)
- [ ] French (Vietnamese diaspora in France)
- [ ] Russian (Vietnamese communities in Russia)
- [ ] Spanish (Latin American Vietnamese)
- [ ] Language selection in Settings
- [ ] RTL support for future languages

**Holiday Calendar Expansion**
- [ ] Additional Vietnamese holidays
  - Regional/local observances
  - Religious holidays
  - Family celebration reminders
- [ ] International holidays
  - American/European major holidays
  - Asian cultural holidays
  - Religious holidays (Christmas, Ramadan, etc.)
- [ ] Holiday crowdsourcing
  - User-submitted holidays
  - Community voting
  - Moderation system

**Community Features**
- [ ] Holiday Sharing
  - Share events with friends/family
  - View shared calendar (read-only)
  - Permission management

- [ ] Event Templates Library
  - Pre-built event templates
  - Community templates
  - Template ratings/reviews

- [ ] Discussion Forums
  - General discussions
  - Holiday planning conversations
  - Best practices sharing

- [ ] Event Analytics
  - Most popular events
  - Community trends
  - Seasonal patterns

**Enhanced Personalization**
- [ ] Custom Themes
  - Color scheme customization
  - Font selection
  - Icon theme options
  - Theme sharing

- [ ] Smart Notifications
  - AI-powered ceremony recommendations
  - Predictive auspicious day suggestions
  - Personalized reminders based on patterns

---

## Phase 4: Advanced Features (Long-term)

### Target: 2026 Q4+

Deep integration with related services and advanced capabilities for power users.

#### Planned Features

**Family Calendar**
- [ ] Multi-user access (encryption enabled)
- [ ] Family event sharing
- [ ] Parental controls
- [ ] Shared celebrations
- [ ] Family member role management

**Location-Based Features**
- [ ] Ceremony location suggestions
- [ ] Temple/shrine location finder
- [ ] Event location reminders
- [ ] Nearby community events
- [ ] Location-based notifications

**Integration with Native Calendars**
- [ ] Apple Calendar sync
- [ ] Google Calendar sync
- [ ] Outlook Calendar sync
- [ ] Two-way synchronization
- [ ] Conflict handling

**Health & Wellness**
- [ ] Lucky day suggestions for important life events
- [ ] Health-based auspicious hour recommendations
- [ ] Fitness event planning on auspicious dates
- [ ] Wellness ceremony suggestions

**Advanced Analytics**
- [ ] Event statistics and insights
- [ ] Lunar pattern analysis
- [ ] Personal auspicious day identification
- [ ] Trend predictions
- [ ] Data visualization dashboard

**Developer API** (Internal Use)
- [ ] REST API for lunar calculations
- [ ] Webhook support for external integrations
- [ ] Rate limiting and authentication
- [ ] SDK for third-party developers
- [ ] API documentation

---

## Technical Improvements Roadmap

### Immediate (Q1 2026)

**Code Quality**
- ✅ Unit tests for lunar algorithms (Vitest)
  - ✅ Test against reference data
  - ✅ Edge case coverage
  - ✅ Performance benchmarks
- [ ] Component integration tests
  - [ ] User flow testing
  - [ ] Event CRUD testing
  - [ ] Navigation testing
- [ ] E2E tests for critical paths
  - [ ] Calendar interaction
  - [ ] Event management
  - [ ] Notification flow

**Documentation**
- ✅ API documentation
  - ✅ Lunar service interface
  - ✅ Store methods
  - ✅ Component prop types
- [ ] Deployment guides
  - [ ] iOS build and deployment
  - [ ] Android build and deployment
  - [ ] Web deployment
- [ ] Troubleshooting guide

**Performance**
- ✅ Bundle size optimization
- ✅ Startup time optimization
- ✅ Calendar navigation and rendering optimization (Phase 1)
- ✅ Runtime data validation and type safety (Phase 2)

### Medium-term (Q2-Q3 2026)

**Security Enhancements**
- [ ] Data encryption at rest
  - [ ] MMKV encryption
  - [ ] Secure key storage
- [ ] Backup encryption
  - [ ] Encrypted JSON exports
  - [ ] Password protection
- [ ] Privacy controls
  - [ ] Data deletion
  - [ ] Export capabilities
  - [ ] Clear all option

**Error Handling**
- [ ] Centralized error handling
  - [ ] Global error boundary
  - [ ] Error logging
  - [ ] User-friendly messages
- [ ] Recovery mechanisms
  - [ ] Automatic retry logic
  - [ ] Fallback strategies
  - [ ] Corruption detection

**Monitoring & Analytics** (Privacy-preserving)
- [ ] Crash reporting
  - [ ] Automated crash detection
  - [ ] Stack trace analysis
  - [ ] Impact assessment
- [ ] Performance monitoring
  - [ ] Load time tracking
  - [ ] Frame rate monitoring
  - [ ] Memory usage tracking
- [ ] Usage insights (opt-in)
  - [ ] Feature usage (anonymized)
  - [ ] User retention metrics
  - [ ] Error patterns

### Long-term (Q4 2026+)

**Architecture Improvements**
- [ ] New Architecture migration complete
  - [ ] All Bridgeless
  - [ ] Full Fabric support
  - [ ] No legacy bridge code
- [ ] WebView optimization
  - [ ] Shared context improvements
  - [ ] Performance tuning
- [ ] Platform parity
  - [ ] 100% feature parity iOS/Android
  - [ ] Web feature completeness

**Scalability**
- [ ] Server infrastructure (if needed)
  - [ ] Cloud sync backend
  - [ ] API infrastructure
  - [ ] Database design
- [ ] Load testing
  - [ ] 10,000+ concurrent users
  - [ ] Database scaling
  - [ ] Cache strategies
- [ ] CDN setup
  - [ ] Asset distribution
  - [ ] Global edge caching

---

## Maintenance & Support

### Regular Maintenance Tasks

**Monthly**
- [ ] Update dependencies
- [ ] Security vulnerability scanning
- [ ] Performance monitoring review
- [ ] User feedback analysis

**Quarterly**
- [ ] Major dependency updates
- [ ] Feature deprecation review
- [ ] Crash rate analysis
- [ ] User retention metrics

**Annually**
- [ ] Major architectural review
- [ ] Platform version support update
- [ ] Long-term roadmap adjustment
- [ ] Community feedback incorporation

### Support Strategy

**User Support**
- FAQ document with common issues
- GitHub Issues for bug reports
- Email support for critical issues
- Community forum on Discord/Reddit (planned)

**Developer Support**
- Comprehensive API documentation
- Example code snippets
- Architecture decision records
- Contributing guidelines

---

## Success Criteria & Milestones

### Phase 1 Completion (MVP)
- **Users**: 1,000+ active users
- **Rating**: 4.0+ stars on app stores
- **Stability**: 99%+ crash-free sessions
- **Accuracy**: 100% lunar conversion accuracy
- **Performance**: All operations < 500ms

### Phase 2 Completion (Enhanced)
- **Users**: 10,000+ active users
- **Features**: Widget + Wearable adoption > 30%
- **Cloud Sync**: 99.5%+ sync success rate
- **Rating**: 4.3+ stars
- **Performance**: All UI operations < 200ms

### Phase 3 Completion (Global)
- **Users**: 50,000+ active users
- **Languages**: 5+ languages fully supported
- **Community**: 1,000+ shared events
- **Rating**: 4.5+ stars
- **Retention**: 50%+ monthly retention

### Phase 4 Vision (Advanced)
- **Users**: 100,000+ active users
- **Platforms**: All planned integrations complete
- **Ecosystem**: Thriving developer community
- **Impact**: De facto standard for Vietnamese lunar calendar
- **Revenue**: Sustainable through premium features

---

## Version History

| Version | Date | Major Changes |
|---------|------|---------------|
| 1.0.0 | 2026-Q1 | MVP Release - Core lunar calendar + events |
| 1.1.0 | 2026-02-12 | Year/month selector grid, editable reminder settings |
| 1.1.1 | 2026-02-12 | Bug fixes and build guide |
| 1.2.0 | 2026-02-12 | Performance Optimization, Vitest & Zod Integration |
| 1.3.0 | 2026-02-13 | Notification Reliability, Event Form UI Refinement, 15m Intervals |
| 1.3.0 | 2026-Q2 | Cloud Sync Integration |
| 2.0.0 | 2026-Q3 | Multi-language + Community |
| 2.1.0+ | 2026-Q4+ | Advanced Features |

---

## Related Documentation

- **[Project Overview & PDR](project-overview-pdr.md)** - Vision, features, requirements
- **[Codebase Summary](codebase-summary.md)** - Code organization and modules
- **[System Architecture](system-architecture.md)** - Technical architecture
- **[Code Standards](code-standards.md)** - Development guidelines
- **[README.md](../README.md)** - Quick start guide
