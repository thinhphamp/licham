import { useTheme } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

interface AccessibleTextProps extends TextProps {
    accessibilityLabel?: string;
    textRole?: 'header' | 'text' | 'button' | 'label';
    variant?: 'body' | 'caption' | 'title' | 'subtitle';
}

export function AccessibleText({
    children,
    accessibilityLabel,
    textRole = 'text',
    variant = 'body',
    style,
    ...props
}: AccessibleTextProps) {
    const theme = useTheme();

    return (
        <Text
            accessible
            accessibilityLabel={accessibilityLabel}
            accessibilityRole={textRole === 'text' ? 'text' : (textRole as any)}
            style={[
                styles.base,
                styles[variant],
                { color: theme.text },
                style,
            ]}
            {...props}
        >
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    base: {
        fontFamily: 'System',
    },
    body: {
        fontSize: 16,
        lineHeight: 22,
    },
    caption: {
        fontSize: 12,
        lineHeight: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        lineHeight: 28,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '600',
        lineHeight: 20,
    },
});
