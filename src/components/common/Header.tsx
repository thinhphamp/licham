import { useTheme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
    title: string;
    showBack?: boolean;
    rightElement?: React.ReactNode;
}

export const Header = ({ title, showBack = false, rightElement }: HeaderProps) => {
    const theme = useTheme();
    const router = useRouter();

    return (
        <View style={[styles.container, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
            <View style={styles.left}>
                {showBack && (
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color={theme.text} />
                    </TouchableOpacity>
                )}
            </View>
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
                {title}
            </Text>
            <View style={styles.right}>{rightElement}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    left: {
        width: 40,
    },
    right: {
        width: 40,
        alignItems: 'flex-end',
    },
    backButton: {
        padding: 4,
        marginLeft: -4,
    },
    title: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600',
    },
});
