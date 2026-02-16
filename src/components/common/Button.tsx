import { useTheme } from '@/constants/theme';
import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button = ({
    title,
    onPress,
    loading = false,
    disabled = false,
    variant = 'primary',
    style,
    textStyle,
}: ButtonProps) => {
    const theme = useTheme();
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';

    const buttonStyle = [
        styles.button,
        isPrimary && { backgroundColor: theme.primary },
        isOutline && { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.primary },
        disabled && { backgroundColor: theme.surface, borderColor: theme.border },
        style,
    ];

    const textStyles = [
        styles.text,
        isPrimary && { color: theme.background },
        isOutline && { color: theme.primary },
        disabled && { color: theme.textMuted },
        textStyle,
    ];

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={buttonStyle}
        >
            {loading ? (
                <ActivityIndicator color={isPrimary ? theme.background : theme.primary} />
            ) : (
                <Text style={textStyles}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
});
