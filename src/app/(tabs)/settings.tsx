import { useTheme } from '@/constants/theme';
import { exportData, importData } from '@/services/dataService';
import { useSettingsStore } from '@/stores/settingsStore';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React, { useRef, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Time options in 15-min intervals
const TIME_OPTIONS = Array.from({ length: 96 }, (_, i) => {
    const hours = Math.floor(i / 4).toString().padStart(2, '0');
    const mins = ((i % 4) * 15).toString().padStart(2, '0');
    return `${hours}:${mins}`;
});

export default function SettingsScreen() {
    const theme = useTheme();
    const {
        reminderDaysBefore,
        reminderTime,
        setReminderDaysBefore,
        setReminderTime,
    } = useSettingsStore();

    const [showTimePicker, setShowTimePicker] = useState(false);
    const [daysInput, setDaysInput] = useState(reminderDaysBefore.toString());
    const timeListRef = useRef<ScrollView>(null);

    const handleDaysChange = (text: string) => {
        setDaysInput(text);
        const num = parseInt(text, 10);
        if (!isNaN(num) && num >= 0) {
            setReminderDaysBefore(num);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.surfaceAlt }]}>
            <View style={[styles.section, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Nhắc nhở mặc định</Text>

                <View style={[styles.row, { borderBottomColor: theme.border }]}>
                    <Text style={[styles.label, { color: theme.text }]}>Nhắc trước (ngày)</Text>
                    <TextInput
                        style={[styles.input, { color: theme.text, borderColor: theme.border }]}
                        value={daysInput}
                        onChangeText={handleDaysChange}
                        keyboardType="number-pad"
                        maxLength={2}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.row, { borderBottomColor: theme.border }]}
                    onPress={() => setShowTimePicker(true)}
                >
                    <Text style={[styles.label, { color: theme.text }]}>Giờ nhắc</Text>
                    <View style={styles.valueRow}>
                        <Text style={[styles.valueText, { color: theme.textSecondary }]}>{reminderTime}</Text>
                        <Ionicons name="chevron-forward" size={16} color={theme.border} />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Time Picker Modal */}
            <Modal visible={showTimePicker} transparent animationType="fade">
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowTimePicker(false)}
                >
                    <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>Chọn giờ nhắc</Text>
                        <ScrollView
                            ref={timeListRef}
                            style={styles.timeList}
                            onLayout={() => {
                                const index = TIME_OPTIONS.indexOf(reminderTime);
                                if (index > 0) {
                                    timeListRef.current?.scrollTo({ y: index * 45 - 90, animated: false });
                                }
                            }}
                        >
                            {TIME_OPTIONS.map((time) => (
                                <TouchableOpacity
                                    key={time}
                                    style={[
                                        styles.timeOption,
                                        { borderBottomColor: theme.border },
                                        time === reminderTime && { backgroundColor: theme.selected },
                                    ]}
                                    onPress={() => {
                                        setReminderTime(time);
                                        setShowTimePicker(false);
                                    }}
                                >
                                    <Text style={[
                                        styles.timeText,
                                        { color: time === reminderTime ? theme.primary : theme.text },
                                    ]}>
                                        {time}
                                    </Text>
                                    {time === reminderTime && (
                                        <Ionicons name="checkmark" size={20} color={theme.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>

            <View style={[styles.section, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Dữ liệu</Text>
                <TouchableOpacity
                    style={[styles.row, { borderBottomColor: theme.border }]}
                    onPress={exportData}
                >
                    <Text style={[styles.label, { color: theme.text }]}>Sao lưu dữ liệu (Xuất file)</Text>
                    <Ionicons name="share-outline" size={20} color={theme.primary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.row, { borderBottomColor: 'transparent' }]}
                    onPress={importData}
                >
                    <Text style={[styles.label, { color: theme.text }]}>Khôi phục dữ liệu (Nhập file)</Text>
                    <Ionicons name="download-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
            </View>

            <View style={[styles.section, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Ứng dụng</Text>
                <View style={[styles.row, { borderBottomColor: theme.border }]}>
                    <Text style={[styles.label, { color: theme.text }]}>Phiên bản</Text>
                    <Text style={[styles.valueText, { color: theme.textSecondary }]}>{Constants.expoConfig?.version ?? '1.0.0'}</Text>
                </View>

                <TouchableOpacity style={[styles.row, { borderBottomColor: 'transparent' }]}>
                    <Text style={[styles.label, { color: theme.text }]}>Phản hồi & Góp ý</Text>
                    <Ionicons name="chevron-forward" size={20} color={theme.border} />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        marginTop: 24,
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    sectionTitle: {
        fontSize: 13,
        marginLeft: 16,
        marginBottom: 8,
        marginTop: 16,
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    label: {
        fontSize: 16,
    },
    valueText: {
        fontSize: 16,
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    input: {
        fontSize: 16,
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        minWidth: 50,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        maxHeight: '60%',
        borderRadius: 12,
        padding: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        textAlign: 'center',
    },
    timeList: {
        maxHeight: 300,
    },
    timeOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    timeText: {
        fontSize: 16,
    },
});
