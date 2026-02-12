# Phase 2: Reliability & Testing

## Objectives
- Ensure 100% accuracy of lunar conversions.
- Prevent invalid data from entering the store.

## Tasks

### 2.1 Unit Testing Suite
- [ ] Setup Vitest in the React Native project.
- [ ] Create `src/services/lunar/__tests__/converter.test.ts`.
- [ ] Add test cases for:
  - Solar to Lunar (standard dates).
  - Lunar to Solar (standard dates).
  - Leap month handling (e.g., year 2023, 2025).
  - Boundary years (1900, 2099).
- [ ] Integrate with GitHub Actions (optional, but recommended).

### 2.2 Zod Schema Integration
- [ ] Define `EventSchema` using Zod in `src/types/event.ts`.
- [ ] Implement `EventFormData.validate()` or a separate validator.
- [ ] Update `EventForm.handleSubmit` to perform validation before adding to store.
- [ ] Add business rules validation (e.g., `lunarDay` cannot be 31 for month 2, etc.).

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
