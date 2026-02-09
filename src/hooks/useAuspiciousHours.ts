import { dateToJd, getAuspiciousHours, getOnlyAuspiciousHours } from '@/services/lunar';
import { useMemo } from 'react';

export function useAuspiciousHours(date: Date | string, onlyAuspicious = false) {
    return useMemo(() => {
        const d = typeof date === 'string' ? new Date(date) : date;
        const jd = dateToJd(d.getDate(), d.getMonth() + 1, d.getFullYear());

        return onlyAuspicious ? getOnlyAuspiciousHours(jd) : getAuspiciousHours(jd);
    }, [date, onlyAuspicious]);
}
