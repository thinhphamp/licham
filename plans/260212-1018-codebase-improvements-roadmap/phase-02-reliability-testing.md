# Phase 2: Reliability & Testing

## Objectives
- Ensure 100% accuracy of lunar conversions.
- Prevent invalid data from entering the store.

## Tasks

### 2.1 Unit Testing Suite
- [x] Setup Vitest in the React Native project.
- [x] Create `src/services/lunar/__tests__/converter.test.ts`.
- [x] Add test cases for:
  - Solar to Lunar (standard dates).
  - Lunar to Solar (standard dates).
  - Leap month handling (e.g., year 2023, 2025).
  - Boundary years (1900, 2099).
- [x] Integrate with GitHub Actions (optional, but recommended).

### 2.2 Zod Schema Integration
- [x] Define `EventSchema` using Zod in `src/types/schemas.ts`.
- [x] Implement `EventFormData.validate()` or a separate validator.
- [x] Update `EventForm.handleSubmit` to perform validation before adding to store.
- [x] Add business rules validation (e.g., `lunarDay` cannot be 31 for month 2, etc.).

## Code Snippet (Conceptual)

```typescript
// src/services/lunar/__tests__/converter.test.ts
import { solarToLunar } from '../converter';

test('converts Solar 2023-04-20 to Lunar 2023-03-01', () => {
    const result = solarToLunar(20, 4, 2023);
    expect(result.day).toBe(1);
    expect(result.month).toBe(3);
    expect(result.year).toBe(2023);
});
```

## Success Criteria
- [ ] `npm test` passes with zero failures.
- [ ] Form shows error messages for invalid date combinations.
