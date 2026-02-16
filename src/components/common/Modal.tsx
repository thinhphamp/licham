import { useTheme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal as RNModal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export const Modal = ({ visible, onClose, title, children }: ModalProps) => {
    const theme = useTheme();

    return (
        <RNModal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
                <View style={[styles.header, { borderBottomColor: theme.border }]}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={theme.textMuted} />
                    </TouchableOpacity>
                    {title && <Text style={[styles.title, { color: theme.text }]}>{title}</Text>}
                    <View style={styles.placeholder} />
                </View>
                <View style={styles.content}>{children}</View>
            </SafeAreaView>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    closeButton: {
        padding: 4,
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
    },
    placeholder: {
        width: 32,
    },
    content: {
        flex: 1,
    },
});
