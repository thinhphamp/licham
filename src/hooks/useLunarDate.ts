import { getDayInfo } from '@/services/lunar';
import { useMemo } from 'react';

export function useLunarDate(date: Date | string) {
    return useMemo(() => {
        const d = typeof date === 'string' ? new Date(date) : date;
        return getDayInfo(d.getDate(), d.getMonth() + 1, d.getFullYear());
    }, [date]);
}
