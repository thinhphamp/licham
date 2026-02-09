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
    const isPrimary = variant === 'primary';
    const isOutline = variant === 'outline';

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.button,
                isPrimary && styles.primaryButton,
                isOutline && styles.outlineButton,
                disabled && styles.disabledButton,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#D4382A'} />
            ) : (
                <Text
                    style={[
                        styles.text,
                        isPrimary && styles.primaryText,
                        isOutline && styles.outlineText,
                        disabled && styles.disabledText,
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
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
    primaryButton: {
        backgroundColor: '#D4382A',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#D4382A',
    },
    disabledButton: {
        backgroundColor: '#F5F5F5',
        borderColor: '#DDDDDD',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
    primaryText: {
        color: '#FFFFFF',
    },
    outlineText: {
        color: '#D4382A',
    },
    disabledText: {
        color: '#999999',
    },
});
