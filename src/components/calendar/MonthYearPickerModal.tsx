import { useTheme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface MonthYearPickerModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (year: number, month: number) => void;
    currentYear: number;
    currentMonth: number;
}

const MONTHS = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
    'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
    'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];

export function MonthYearPickerModal({
    visible,
    onClose,
    onSelect,
    currentYear: initialYear,
    currentMonth: initialMonth,
}: MonthYearPickerModalProps) {
    const theme = useTheme();
    const [selectedYear, setSelectedYear] = useState(initialYear);

    const handleMonthSelect = (monthIndex: number) => {
        onSelect(selectedYear, monthIndex + 1);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <View style={[styles.container, { backgroundColor: theme.background }]}>
                    <View style={[styles.header, { borderBottomColor: theme.border }]}>
                        <TouchableOpacity
                            onPress={() => setSelectedYear(selectedYear - 1)}
                            style={styles.yearButton}
                        >
                            <Ionicons name="chevron-back" size={24} color={theme.primary} />
                        </TouchableOpacity>
                        <Text style={[styles.yearText, { color: theme.text }]}>Năm {selectedYear}</Text>
                        <TouchableOpacity
                            onPress={() => setSelectedYear(selectedYear + 1)}
                            style={styles.yearButton}
                        >
                            <Ionicons name="chevron-forward" size={24} color={theme.primary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.monthGrid}>
                        {MONTHS.map((month, index) => {
                            const isSelected = selectedYear === initialYear && (index + 1) === initialMonth;
                            return (
                                <TouchableOpacity
                                    key={month}
                                    style={[
                                        styles.monthItem,
                                        isSelected && { backgroundColor: theme.selected, borderColor: theme.primary }
                                    ]}
                                    onPress={() => handleMonthSelect(index)}
                                >
                                    <Text style={[
                                        styles.monthText,
                                        { color: theme.text },
                                        isSelected && { color: theme.primary, fontWeight: '600' }
                                    ]}>
                                        {month}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <TouchableOpacity
                        style={[styles.closeButton, { borderTopColor: theme.border }]}
                        onPress={onClose}
                    >
                        <Text style={[styles.closeButtonText, { color: theme.textSecondary }]}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    container: {
        width: '85%',
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    yearButton: {
        padding: 5,
    },
    yearText: {
        fontSize: 18,
        fontWeight: '700',
    },
    monthGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 12,
    },
    monthItem: {
        width: '33.33%',
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    monthText: {
        fontSize: 15,
    },
    closeButton: {
        paddingVertical: 16,
        alignItems: 'center',
        borderTopWidth: 1,
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
