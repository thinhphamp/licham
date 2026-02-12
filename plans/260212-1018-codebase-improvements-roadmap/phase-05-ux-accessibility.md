# Phase 5: UX & Accessibility

## Objectives
- Professionalize the visual identity.
- Ensure the app is usable by everyone.

## Tasks

### 5.1 Assets & Launch Optimization
- [ ] Regenerate high-resolution icons (1024x1024) and splash screens using `expo-optimize` or manual tools.
- [ ] Configure `expo-splash-screen` to prevent flickering during store hydration.
- [ ] Implement a loading state for the initial data sync.

### 5.2 Accessibility Audit & Implementation
- [ ] Add `accessibilityLabel` to all interactive items.
- [ ] Ensure the Calendar grid generates descriptive text for screen readers (e.g., "Thứ Hai, ngày 12 tháng 5, ngày rằm tháng tư").
- [ ] Support system font scaling in all Typography components.

## Success Criteria
- [ ] App launches without a "white splash" before showing content.
- [ ] Screen reader can navigate the calendar month accurately.
