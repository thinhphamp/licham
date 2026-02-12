---
title: "Codebase Improvements Roadmap"
description: "Implementation plan for 10 technical improvements identified during codebase review"
status: pending
priority: P1
effort: 3-5 days
branch: tech-debt-cleanup
tags: [performance, reliability, testing, architecture]
created: 2026-02-12
---

# Codebase Improvements Roadmap

## Overview
This roadmap addresses 10 key technical issues identified to elevate the project to production-grade quality, focusing on performance, reliability, and maintainability.

## Current State
- No unit tests for core lunar algorithms.
- Calendar rendering triggers excessive re-renders.
- Notification scheduling only handles the immediate next occurrence.
- Mixed responsibilities in services and constants.

## Target State
- 100% test coverage for `converter.ts`.
- Optimized calendar grid with specialized memoized components.
- Reliable notification system that refreshes on app startup.
- Clean separation of concerns between logic, types, and constants.

## Implementation Phases

| Phase | Description | Status |
|-------|-------------|--------|
| [Phase 1](./phase-01-performance-optimization.md) | Calendar rendering & Pre-calculation | Pending |
| [Phase 2](./phase-02-reliability-testing.md) | Unit tests & Validation | Pending |
| [Phase 3](./phase-03-notification-system.md) | Recurrence refresh & Background tasks | Pending |
| [Phase 4](./phase-04-architecture-refactor.md) | Service splitting & Constants cleanup | Pending |
| [Phase 5](./phase-05-ux-accessibility.md) | Deep linking & A11y | Pending |

## Success Criteria
- [ ] No frame drops during calendar month switching.
- [ ] 0% regression in lunar date conversion (verified by tests).
- [ ] Notifications always scheduled for next year if current is missed.
- [ ] Clean type-safe data flow using Zod.

## Related Files
- `src/components/calendar/CalendarView.tsx`
- `src/services/lunar/converter.ts`
- `src/services/notifications/index.ts`
- `src/stores/eventStore.ts`
