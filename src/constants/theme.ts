import { useSettingsStore } from '@/stores/settingsStore';
import { useColorScheme } from 'react-native';

export const palette = {
    white: '#FFFFFF',
    black: '#000000',
    red: '#D4382A',
    darkRed: '#A32920',
    gold: '#C4982E',
    lightGold: '#FFF9E6',
    gray1: '#1A1A1A',
    gray2: '#2A2A2A',
    gray3: '#666666',
    gray4: '#888888',
    gray5: '#CCCCCC',
    gray6: '#DDDDDD',
    gray7: '#EEEEEE',
    gray8: '#F5F5F5',
    gray9: '#F8F8F8',
    redLight: '#FFF3F0',
    redDark: '#3A2020',
};

export const colors = {
    light: {
        primary: palette.red,
        secondary: palette.gold,
        background: palette.white,
        surface: palette.gray8,
        surfaceAlt: palette.gray9,
        text: palette.gray1,
        textSecondary: palette.gray3,
        textMuted: palette.gray4,
        border: palette.gray7,
        lunar: palette.gray4,
        holiday: palette.red,
        auspicious: palette.gold,
        today: palette.red,
        selected: palette.redLight,
        error: '#FF3B30',
    },
    dark: {
        primary: '#FF5A4D',
        secondary: '#E6B84D',
        background: palette.gray1,
        surface: palette.gray2,
        surfaceAlt: '#121212',
        text: palette.white,
        textSecondary: '#AAAAAA',
        textMuted: palette.gray4,
        border: '#3A3A3A',
        lunar: palette.gray4,
        holiday: '#FF5A4D',
        auspicious: '#E6B84D',
        today: '#FF5A4D',
        selected: palette.redDark,
        error: '#FF453A',
    },
};

export function useTheme() {
    const systemColorScheme = useColorScheme();
    const themeMode = useSettingsStore((s) => s.themeMode);

    // Determine effective color scheme
    const effectiveScheme = themeMode === 'system'
        ? systemColorScheme
        : themeMode;

    const theme = effectiveScheme === 'dark' ? colors.dark : colors.light;

    return {
        ...theme,
        isDark: effectiveScheme === 'dark',
    };
}
