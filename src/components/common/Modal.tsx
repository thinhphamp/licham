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
    return (
        <RNModal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#666666" />
                    </TouchableOpacity>
                    {title && <Text style={styles.title}>{title}</Text>}
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
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    closeButton: {
        padding: 4,
    },
    title: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    placeholder: {
        width: 32,
    },
    content: {
        flex: 1,
    },
});
