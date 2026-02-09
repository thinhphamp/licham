# Phase 2: Lunar Calendar Core

## Context Links
- [Main Plan](./plan.md)
- [Research Report](./reports/01-research-report.md)
- Previous: [Phase 1: Project Setup](./phase-01-project-setup.md)
- Next: [Phase 3: Calendar UI](./phase-03-calendar-ui.md)

---

## Overview

| Field | Value |
|-------|-------|
| Date | 2026-02-05 |
| Description | Implement Vietnamese lunar calendar conversion and auspicious hours calculation |
| Priority | P1 (Critical Path) |
| Status | completed |
| Effort | 20h |

---

## Key Insights

1. **Algorithm Source**: Ho Ngoc Duc's algorithm based on "Calendrical Calculations" book
2. **Time Zone Critical**: Vietnam GMT+7 affects month boundaries - same moment can be different lunar date vs Chinese calendar
3. **Date Range**: Support 1900-2100 for practical use (algorithm supports wider range)
4. **Giờ Hoàng Đạo**: Based on day's Earthly Branch (Chi), 6 auspicious + 6 inauspicious hours
5. **Can Chi**: 10 Heavenly Stems x 12 Earthly Branches = 60-year cycle

---

## Requirements

### Functional
- R2.1: Convert solar date to lunar date (day, month, year, leap month flag)
- R2.2: Convert lunar date to solar date
- R2.3: Calculate Can Chi for year, month, day, hour
- R2.4: Calculate giờ hoàng đạo for any given day
- R2.5: Provide Vietnamese holidays for any year
- R2.6: Handle leap months correctly

### Non-Functional
- R2.7: Calculation must complete in <10ms
- R2.8: 100% unit test coverage for conversion functions
- R2.9: Validate accuracy against reference calendar
- R2.10: Anchor all calculations to Vietnam GMT+7, regardless of device locale
- R2.11: Define fallback logic for lunar events in non-leap years (mapping leap month to regular month)

---

## Architecture

### Lunar Service Structure

```
src/services/lunar/
├── index.ts              # Public API exports
├── converter.ts          # Solar <-> Lunar conversion
├── newMoon.ts           # New moon calculation
├── solarTerm.ts         # Solar term (Principal Term) calculation
├── canChi.ts            # Can Chi (Stems/Branches) calculation
├── auspiciousHours.ts   # Giờ hoàng đạo logic
├── holidays.ts          # Vietnamese holidays
└── types.ts             # TypeScript interfaces
```

### Data Flow

```
Solar Date (2026-02-17)
        │
        ▼
┌───────────────────┐
│   New Moon Calc   │ → Find lunar month boundaries
└───────────────────┘
        │
        ▼
┌───────────────────┐
│  Solar Term Calc  │ → Determine leap month
└───────────────────┘
        │
        ▼
┌───────────────────┐
│   Can Chi Calc    │ → Year/Month/Day/Hour stems & branches
└───────────────────┘
        │
        ▼
Lunar Date { day: 1, month: 1, year: 2026, leap: false, canChi: {...} }
```

---

## Related Code Files

### File: `src/services/lunar/types.ts`
```typescript
export interface LunarDate {
  day: number;        // 1-30
  month: number;      // 1-12
  year: number;       // e.g., 2026
  leap: boolean;      // is this a leap month?
  jd: number;         // Julian day number
}

export interface SolarDate {
  day: number;
  month: number;
  year: number;
}

export interface CanChi {
  can: string;        // Heavenly Stem (Giáp, Ất, Bính...)
  chi: string;        // Earthly Branch (Tý, Sửu, Dần...)
  fullName: string;   // Combined name (Giáp Tý)
  index: number;      // Position in 60-year cycle (0-59)
}

export interface DayInfo {
  solar: SolarDate;
  lunar: LunarDate;
  yearCanChi: CanChi;
  monthCanChi: CanChi;
  dayCanChi: CanChi;
  zodiacAnimal: string;  // Con giáp (Tý, Sửu, Dần...)
  solarTerm?: string;    // Tiết khí if applicable
}

export interface AuspiciousHour {
  name: string;       // Tý, Sửu, etc.
  startTime: string;  // "23:00"
  endTime: string;    // "01:00"
  isAuspicious: boolean;
  star?: string;      // Thanh Long, Kim Quỹ, etc.
}

export interface Holiday {
  name: string;
  nameLatin: string;
  lunarMonth: number;
  lunarDay: number;
  description?: string;
  isNational: boolean;
}
```

### File: `src/services/lunar/converter.ts`
```typescript
import { LunarDate, SolarDate } from './types';
import { getNewMoonDay, getSunLongitude } from './newMoon';

const TIMEZONE = 7; // Vietnam GMT+7

/**
 * Convert Julian Day Number to Solar Date
 */
export function jdToDate(jd: number): SolarDate {
  const Z = Math.floor(jd + 0.5);
  const F = jd + 0.5 - Z;
  let A: number;

  if (Z < 2299161) {
    A = Z;
  } else {
    const alpha = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alpha - Math.floor(alpha / 4);
  }

  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);

  const day = B - D - Math.floor(30.6001 * E) + F;
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;

  return { day: Math.floor(day), month, year };
}

/**
 * Convert Solar Date to Julian Day Number
 */
export function dateToJd(day: number, month: number, year: number): number {
  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;

  let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4);

  if (year > 1582 || (year === 1582 && (month > 10 || (month === 10 && day >= 15)))) {
    jd = jd - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  } else {
    jd = jd - 32083;
  }

  return jd;
}

/**
 * Get lunar month info for a given lunar month
 * Returns [newMoonJD, leapMonth] where leapMonth is 0 if not leap
 */
function getLunarMonth11(year: number): number {
  const off = dateToJd(31, 12, year) - 2415021;
  const k = Math.floor(off / 29.530588853);
  let nm = getNewMoonDay(k, TIMEZONE);
  const sunLong = getSunLongitude(nm, TIMEZONE);

  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, TIMEZONE);
  }

  return nm;
}

/**
 * Determine leap month in lunar year
 * Returns 0 if no leap month, or the leap month number (1-12)
 */
function getLeapMonthOffset(a11: number): number {
  const k = Math.floor((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, TIMEZONE), TIMEZONE);

  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, TIMEZONE), TIMEZONE);
  } while (arc !== last && i < 14);

  return i - 1;
}

/**
 * Convert Solar Date to Lunar Date
 */
export function solarToLunar(dd: number, mm: number, yy: number): LunarDate {
  const dayNumber = dateToJd(dd, mm, yy);
  const k = Math.floor((dayNumber - 2415021.076998695) / 29.530588853);

  let monthStart = getNewMoonDay(k + 1, TIMEZONE);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, TIMEZONE);
  }

  let a11 = getLunarMonth11(yy);
  let b11 = a11;

  let lunarYear: number;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1);
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);

  let lunarLeap = false;
  let lunarMonth = diff + 11;

  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = true;
      }
    }
  }

  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }

  return {
    day: lunarDay,
    month: lunarMonth,
    year: lunarYear,
    leap: lunarLeap,
    jd: dayNumber,
  };
}

/**
 * Convert Lunar Date to Solar Date
 */
export function lunarToSolar(
  lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  lunarLeap: boolean = false
): SolarDate {
  let a11: number, b11: number;

  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1);
    b11 = getLunarMonth11(lunarYear);
  } else {
    a11 = getLunarMonth11(lunarYear);
    b11 = getLunarMonth11(lunarYear + 1);
  }

  const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lunarMonth - 11;
  if (off < 0) {
    off += 12;
  }

  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11);
    let leapMonth = leapOff - 2;
    if (leapMonth < 0) {
      leapMonth += 12;
    }
    if (lunarLeap && lunarMonth !== leapMonth) {
      return { day: 0, month: 0, year: 0 }; // Invalid leap month
    }
    if (lunarLeap || off >= leapOff) {
      off += 1;
    }
  }

  const monthStart = getNewMoonDay(k + off, TIMEZONE);
  return jdToDate(monthStart + lunarDay - 1);
}
```

### File: `src/services/lunar/newMoon.ts`
```typescript
const PI = Math.PI;

/**
 * Calculate Julian day number of the k-th new moon after J2000
 * Algorithm from "Astronomical Algorithms" by Jean Meeus
 */
export function getNewMoonDay(k: number, timeZone: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;

  const dr = PI / 180;

  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);

  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;

  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.001 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));

  let deltat: number;
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }

  const JdNew = Jd1 + C1 - deltat;
  return Math.floor(JdNew + 0.5 + timeZone / 24);
}

/**
 * Calculate sun longitude at a given Julian day
 * Returns position in zodiac (0-11)
 */
export function getSunLongitude(jd: number, timeZone: number): number {
  const T = (jd - 2451545.5 - timeZone / 24) / 36525;
  const T2 = T * T;
  const dr = PI / 180;

  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;

  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);

  let L = L0 + DL;
  L = L * dr;
  L = L - PI * 2 * Math.floor(L / (PI * 2));

  return Math.floor((L / PI) * 6);
}
```

### File: `src/services/lunar/canChi.ts`
```typescript
import { CanChi } from './types';

// Thiên Can (Heavenly Stems)
const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];

// Địa Chi (Earthly Branches)
const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

// Vietnamese zodiac animals (same order as CHI)
const ZODIAC_ANIMALS = [
  'Chuột', 'Trâu', 'Hổ', 'Mèo', 'Rồng', 'Rắn',
  'Ngựa', 'Dê', 'Khỉ', 'Gà', 'Chó', 'Lợn'
];

/**
 * Calculate Can Chi for lunar year
 */
export function getYearCanChi(lunarYear: number): CanChi {
  const canIndex = (lunarYear + 6) % 10;
  const chiIndex = (lunarYear + 8) % 12;

  return {
    can: CAN[canIndex],
    chi: CHI[chiIndex],
    fullName: `${CAN[canIndex]} ${CHI[chiIndex]}`,
    index: (canIndex * 12 + chiIndex) % 60,
  };
}

/**
 * Calculate Can Chi for lunar month
 * Depends on lunar year's Can
 */
export function getMonthCanChi(lunarMonth: number, lunarYear: number): CanChi {
  const yearCan = (lunarYear + 6) % 10;
  // First month starts from Dần (index 2)
  const chiIndex = (lunarMonth + 1) % 12;
  // Can of month depends on year's Can
  const canIndex = (yearCan * 2 + lunarMonth) % 10;

  return {
    can: CAN[canIndex],
    chi: CHI[chiIndex],
    fullName: `${CAN[canIndex]} ${CHI[chiIndex]}`,
    index: (canIndex * 12 + chiIndex) % 60,
  };
}

/**
 * Calculate Can Chi for a day using Julian Day Number
 */
export function getDayCanChi(jd: number): CanChi {
  const canIndex = (jd + 9) % 10;
  const chiIndex = (jd + 1) % 12;

  return {
    can: CAN[canIndex],
    chi: CHI[chiIndex],
    fullName: `${CAN[canIndex]} ${CHI[chiIndex]}`,
    index: (canIndex * 12 + chiIndex) % 60,
  };
}

/**
 * Calculate Can Chi for an hour
 * Hour Chi is fixed (Tý = 23:00-01:00)
 * Hour Can depends on day's Can
 */
export function getHourCanChi(hour: number, dayJd: number): CanChi {
  // Convert hour to Chi index (Tý starts at 23:00)
  const chiIndex = Math.floor(((hour + 1) % 24) / 2);

  // Hour Can depends on day's Can
  const dayCan = (dayJd + 9) % 10;
  const canIndex = (dayCan * 2 + chiIndex) % 10;

  return {
    can: CAN[canIndex],
    chi: CHI[chiIndex],
    fullName: `${CAN[canIndex]} ${CHI[chiIndex]}`,
    index: (canIndex * 12 + chiIndex) % 60,
  };
}

/**
 * Get Vietnamese zodiac animal for a lunar year
 */
export function getZodiacAnimal(lunarYear: number): string {
  const chiIndex = (lunarYear + 8) % 12;
  return ZODIAC_ANIMALS[chiIndex];
}

/**
 * Get the Chi (Earthly Branch) index for a given Julian Day
 * Used for auspicious hour calculation
 */
export function getDayChi(jd: number): number {
  return (jd + 1) % 12;
}

export { CAN, CHI, ZODIAC_ANIMALS };
```

### File: `src/services/lunar/auspiciousHours.ts`
```typescript
import { AuspiciousHour } from './types';
import { CHI, getDayChi } from './canChi';

// Giờ hoàng đạo lookup by day's Chi index
// Each array contains indices of auspicious hour Chi (0-11)
// Based on traditional Vietnamese almanac
const AUSPICIOUS_HOURS_BY_DAY_CHI: Record<number, number[]> = {
  0:  [0, 1, 4, 5, 8, 9],    // Ngày Tý: Tý, Sửu, Thìn, Tỵ, Thân, Dậu
  1:  [2, 3, 6, 7, 10, 11],  // Ngày Sửu: Dần, Mão, Ngọ, Mùi, Tuất, Hợi
  2:  [0, 1, 4, 5, 8, 9],    // Ngày Dần: Tý, Sửu, Thìn, Tỵ, Thân, Dậu
  3:  [2, 3, 6, 7, 10, 11],  // Ngày Mão: Dần, Mão, Ngọ, Mùi, Tuất, Hợi
  4:  [0, 1, 4, 5, 8, 9],    // Ngày Thìn: Tý, Sửu, Thìn, Tỵ, Thân, Dậu
  5:  [2, 3, 6, 7, 10, 11],  // Ngày Tỵ: Dần, Mão, Ngọ, Mùi, Tuất, Hợi
  6:  [0, 1, 4, 5, 8, 9],    // Ngày Ngọ: Tý, Sửu, Thìn, Tỵ, Thân, Dậu
  7:  [2, 3, 6, 7, 10, 11],  // Ngày Mùi: Dần, Mão, Ngọ, Mùi, Tuất, Hợi
  8:  [0, 1, 4, 5, 8, 9],    // Ngày Thân: Tý, Sửu, Thìn, Tỵ, Thân, Dậu
  9:  [2, 3, 6, 7, 10, 11],  // Ngày Dậu: Dần, Mão, Ngọ, Mùi, Tuất, Hợi
  10: [0, 1, 4, 5, 8, 9],    // Ngày Tuất: Tý, Sửu, Thìn, Tỵ, Thân, Dậu
  11: [2, 3, 6, 7, 10, 11],  // Ngày Hợi: Dần, Mão, Ngọ, Mùi, Tuất, Hợi
};

// Six auspicious stars (Lục Hoàng Đạo)
const AUSPICIOUS_STARS = [
  'Thanh Long',   // Azure Dragon - most auspicious
  'Minh Đường',   // Bright Hall
  'Kim Quỹ',      // Golden Cabinet
  'Thiên Đức',    // Heavenly Virtue
  'Ngọc Đường',   // Jade Hall
  'Tư Mệnh',      // Commanding Fate
];

// Hour time ranges
const HOUR_TIMES: [string, string][] = [
  ['23:00', '01:00'], // Tý
  ['01:00', '03:00'], // Sửu
  ['03:00', '05:00'], // Dần
  ['05:00', '07:00'], // Mão
  ['07:00', '09:00'], // Thìn
  ['09:00', '11:00'], // Tỵ
  ['11:00', '13:00'], // Ngọ
  ['13:00', '15:00'], // Mùi
  ['15:00', '17:00'], // Thân
  ['17:00', '19:00'], // Dậu
  ['19:00', '21:00'], // Tuất
  ['21:00', '23:00'], // Hợi
];

/**
 * Get all 12 hours with auspicious status for a given Julian Day
 */
export function getAuspiciousHours(jd: number): AuspiciousHour[] {
  const dayChi = getDayChi(jd);
  const auspiciousIndices = AUSPICIOUS_HOURS_BY_DAY_CHI[dayChi];

  return CHI.map((name, index) => {
    const isAuspicious = auspiciousIndices.includes(index);
    const starIndex = auspiciousIndices.indexOf(index);

    return {
      name,
      startTime: HOUR_TIMES[index][0],
      endTime: HOUR_TIMES[index][1],
      isAuspicious,
      star: isAuspicious ? AUSPICIOUS_STARS[starIndex] : undefined,
    };
  });
}

/**
 * Get only auspicious hours for a day
 */
export function getOnlyAuspiciousHours(jd: number): AuspiciousHour[] {
  return getAuspiciousHours(jd).filter((h) => h.isAuspicious);
}

/**
 * Check if a specific hour is auspicious
 */
export function isHourAuspicious(hour: number, jd: number): boolean {
  const chiIndex = Math.floor(((hour + 1) % 24) / 2);
  const dayChi = getDayChi(jd);
  return AUSPICIOUS_HOURS_BY_DAY_CHI[dayChi].includes(chiIndex);
}
```

### File: `src/constants/holidays.ts`
```typescript
import { Holiday } from '@/services/lunar/types';

export const VIETNAMESE_HOLIDAYS: Holiday[] = [
  // National Holidays (Lunar)
  {
    name: 'Tết Nguyên Đán',
    nameLatin: 'Tet Nguyen Dan',
    lunarMonth: 1,
    lunarDay: 1,
    description: 'Vietnamese Lunar New Year - most important holiday',
    isNational: true,
  },
  {
    name: 'Mùng 2 Tết',
    nameLatin: 'Tet Day 2',
    lunarMonth: 1,
    lunarDay: 2,
    description: 'Second day of Tet - visiting maternal family',
    isNational: true,
  },
  {
    name: 'Mùng 3 Tết',
    nameLatin: 'Tet Day 3',
    lunarMonth: 1,
    lunarDay: 3,
    description: 'Third day of Tet - visiting teachers',
    isNational: true,
  },
  {
    name: 'Tết Nguyên Tiêu',
    nameLatin: 'Tet Nguyen Tieu',
    lunarMonth: 1,
    lunarDay: 15,
    description: 'First full moon of the year - temple visits',
    isNational: false,
  },
  {
    name: 'Tết Thanh Minh',
    nameLatin: 'Tet Thanh Minh',
    lunarMonth: 3,
    lunarDay: 3,
    description: 'Tomb Sweeping Day - visit ancestral graves',
    isNational: false,
  },
  {
    name: 'Giỗ Tổ Hùng Vương',
    nameLatin: 'Hung Kings Commemoration',
    lunarMonth: 3,
    lunarDay: 10,
    description: 'Commemoration of legendary founders of Vietnam',
    isNational: true,
  },
  {
    name: 'Tết Đoan Ngọ',
    nameLatin: 'Tet Doan Ngo',
    lunarMonth: 5,
    lunarDay: 5,
    description: 'Mid-year festival - killing insects ritual',
    isNational: false,
  },
  {
    name: 'Lễ Vu Lan',
    nameLatin: 'Vu Lan Festival',
    lunarMonth: 7,
    lunarDay: 15,
    description: 'Ghost Festival - honoring ancestors and wandering spirits',
    isNational: false,
  },
  {
    name: 'Tết Trung Thu',
    nameLatin: 'Mid-Autumn Festival',
    lunarMonth: 8,
    lunarDay: 15,
    description: "Children's festival with mooncakes and lanterns",
    isNational: false,
  },
  {
    name: 'Tết Trùng Cửu',
    nameLatin: 'Double Ninth Festival',
    lunarMonth: 9,
    lunarDay: 9,
    description: 'Day to climb heights and remember ancestors',
    isNational: false,
  },
  {
    name: 'Tết Hạ Nguyên',
    nameLatin: 'Tet Ha Nguyen',
    lunarMonth: 10,
    lunarDay: 15,
    description: 'Third full moon ceremony',
    isNational: false,
  },
  {
    name: 'Ông Công Ông Táo',
    nameLatin: 'Kitchen Gods Day',
    lunarMonth: 12,
    lunarDay: 23,
    description: 'Kitchen Gods return to heaven to report',
    isNational: false,
  },
  {
    name: 'Tất Niên',
    nameLatin: 'New Year Eve',
    lunarMonth: 12,
    lunarDay: 30, // or 29 if month has 29 days
    description: 'Last day of lunar year - family reunion dinner',
    isNational: false,
  },
];

// Monthly recurring observances
export const MONTHLY_OBSERVANCES = [
  { lunarDay: 1, name: 'Mùng Một', description: 'First day of lunar month' },
  { lunarDay: 15, name: 'Rằm', description: 'Full moon day - temple visits' },
];

/**
 * Get holidays for a specific lunar month
 */
export function getHolidaysForMonth(lunarMonth: number): Holiday[] {
  return VIETNAMESE_HOLIDAYS.filter((h) => h.lunarMonth === lunarMonth);
}

/**
 * Check if a lunar date is a holiday
 */
export function getHolidayForDate(lunarDay: number, lunarMonth: number): Holiday | undefined {
  return VIETNAMESE_HOLIDAYS.find(
    (h) => h.lunarDay === lunarDay && h.lunarMonth === lunarMonth
  );
}
```

### File: `src/services/lunar/index.ts`
```typescript
// Main public API for lunar calendar service
export { solarToLunar, lunarToSolar, dateToJd, jdToDate } from './converter';
export { getYearCanChi, getMonthCanChi, getDayCanChi, getHourCanChi, getZodiacAnimal, CAN, CHI } from './canChi';
export { getAuspiciousHours, getOnlyAuspiciousHours, isHourAuspicious } from './auspiciousHours';
export { VIETNAMESE_HOLIDAYS, MONTHLY_OBSERVANCES, getHolidaysForMonth, getHolidayForDate } from '../../constants/holidays';
export type { LunarDate, SolarDate, CanChi, DayInfo, AuspiciousHour, Holiday } from './types';

import { solarToLunar, dateToJd } from './converter';
import { getYearCanChi, getMonthCanChi, getDayCanChi, getZodiacAnimal } from './canChi';
import { getAuspiciousHours } from './auspiciousHours';
import { getHolidayForDate } from '../../constants/holidays';
import { DayInfo, Holiday } from './types';

/**
 * Get complete day information for a solar date
 * This is the main convenience function
 */
export function getDayInfo(day: number, month: number, year: number): DayInfo & { holiday?: Holiday } {
  const lunar = solarToLunar(day, month, year);
  const jd = dateToJd(day, month, year);

  return {
    solar: { day, month, year },
    lunar,
    yearCanChi: getYearCanChi(lunar.year),
    monthCanChi: getMonthCanChi(lunar.month, lunar.year),
    dayCanChi: getDayCanChi(jd),
    zodiacAnimal: getZodiacAnimal(lunar.year),
    holiday: getHolidayForDate(lunar.day, lunar.month),
  };
}
```

---

## Implementation Steps

### Step 1: Create Type Definitions (1h)
Create `src/services/lunar/types.ts` with all interfaces.

### Step 2: Implement New Moon Calculation (3h)
Port astronomical algorithm from Ho Ngoc Duc's work.
- Implement `getNewMoonDay()`
- Implement `getSunLongitude()`
- Test against known new moon dates

### Step 3: Implement Solar-Lunar Conversion (4h)
Create `converter.ts`:
- Julian Day Number conversion
- Solar to Lunar algorithm
- Lunar to Solar algorithm
- Handle leap months correctly

### Step 4: Implement Can Chi Calculation (2h)
Create `canChi.ts`:
- Year Can Chi (60-year cycle)
- Month Can Chi (depends on year)
- Day Can Chi (Julian day based)
- Hour Can Chi (depends on day)

### Step 5: Implement Auspicious Hours (2h)
Create `auspiciousHours.ts`:
- Build lookup table for each day's Chi
- Map to six auspicious stars
- Generate 12-hour display

### Step 6: Create Holidays Data (2h)
Create `constants/holidays.ts`:
- All Vietnamese lunar holidays
- Monthly observances (Rằm, Mùng Một)
- Query functions

### Step 7: Write Unit Tests (4h)
Test cases:
- Known lunar dates (Tết 2026 = Feb 17)
- Leap month handling
- Edge cases (year boundaries, century)
- Auspicious hours by day type

### Step 8: Create Hooks (2h)
Create custom hooks:
- `useLunarDate(solarDate)`
- `useAuspiciousHours(date)`
- `useDayInfo(date)`

---

## Todo List

- [x] Create `types.ts` with all interfaces
- [x] Implement `newMoon.ts` with astronomical calculations
- [x] Implement `converter.ts` with solar/lunar conversion
- [x] Implement `canChi.ts` for heavenly stems/earthly branches
- [x] Implement `auspiciousHours.ts` with lookup tables
- [x] Create `holidays.ts` with Vietnamese holidays
- [x] Create public API in `index.ts`
- [x] Write tests for new moon calculation
- [x] Write tests for solar→lunar conversion
- [x] Write tests for lunar→solar conversion
- [x] Write tests for leap month handling
- [x] Write tests for Can Chi
- [x] Write tests for auspicious hours
- [ ] Create `useLunarDate` hook
- [ ] Create `useAuspiciousHours` hook
- [ ] Validate against Vietnamese calendar 2026

---

## Success Criteria

- [ ] `solarToLunar(17, 2, 2026)` returns `{ day: 1, month: 1, year: 2026, leap: false }`
- [ ] `lunarToSolar(1, 1, 2026, false)` returns `{ day: 17, month: 2, year: 2026 }`
- [ ] Can Chi for 2026 is "Bính Ngọ" (Year of the Horse)
- [ ] Auspicious hours match traditional Vietnamese almanac
- [ ] All 13 holidays correctly identified
- [ ] 100% test coverage for core functions
- [ ] All calculations <10ms

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Algorithm bugs in edge cases | High | Medium | Extensive testing, reference validation |
| Leap month calculation errors | High | Medium | Compare with multiple sources |
| Timezone handling issues | Medium | Low | Always use GMT+7 constant |
| Performance on date ranges | Low | Low | Cache frequently used calculations |

---

## Security Considerations

- No user input in calculations (prevent injection)
- Date range validation to prevent DoS
- No network calls - pure algorithmic

---

## Next Steps

After completing Phase 2:
1. Validate against published Vietnamese calendar
2. Benchmark performance
3. Commit with message: "Phase 2: Lunar calendar core implementation"
4. Proceed to [Phase 3: Calendar UI](./phase-03-calendar-ui.md)
