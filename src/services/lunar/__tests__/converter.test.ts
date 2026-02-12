import { describe, expect, it } from 'vitest';
import { lunarToSolar, solarToLunar } from '../converter';

describe('Lunar Converter', () => {
    describe('solarToLunar', () => {
        it('should correctly convert Solar 2024-02-12 to Lunar 2024-01-03', () => {
            const result = solarToLunar(12, 2, 2024);
            expect(result.day).toBe(3);
            expect(result.month).toBe(1);
            expect(result.year).toBe(2024);
            expect(result.leap).toBe(false);
        });

        it('should correctly convert Solar 2023-04-20 to Lunar 2023-03-01', () => {
            const result = solarToLunar(20, 4, 2023); // 2023 had a leap month 2
            expect(result.day).toBe(1);
            expect(result.month).toBe(3);
            expect(result.year).toBe(2023);
        });

        it('should handle leap months correctly (Year 2023 - Leap Month 2)', () => {
            // Solar 2023-03-22 is Lunar 2023-02-01 (Leap)
            const result = solarToLunar(22, 3, 2023);
            expect(result.day).toBe(1);
            expect(result.month).toBe(2);
            expect(result.leap).toBe(true);
        });
    });

    describe('lunarToSolar', () => {
        it('should correctly convert Lunar 2024-01-03 to Solar 2024-02-12', () => {
            const result = lunarToSolar(3, 1, 2024);
            expect(result.day).toBe(12);
            expect(result.month).toBe(2);
            expect(result.year).toBe(2024);
        });

        it('should handle leap month conversion back to solar', () => {
            // Lunar 2023-02-01 (Leap) to Solar 2023-03-22
            const result = lunarToSolar(1, 2, 2023, true);
            expect(result.day).toBe(22);
            expect(result.month).toBe(3);
            expect(result.year).toBe(2023);
        });
    });
});
