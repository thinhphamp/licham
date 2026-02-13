import { useTheme } from '@/constants/theme';
import { exportData, importData } from '@/services/dataService';
import { scheduleTestNotification } from '@/services/notifications';
import { useSettingsStore } from '@/stores/settingsStore';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';



export default function SettingsScreen() {
    const theme = useTheme();
    const {
        reminderDaysBefore,
        reminderTime,
        setReminderDaysBefore,
        setReminderTime,
    } = useSettingsStore();

    const [daysInput, setDaysInput] = useState(reminderDaysBefore.toString());
    const [timeInput, setTimeInput] = useState(reminderTime);

    const handleDaysChange = (text: string) => {
        setDaysInput(text);
        const num = parseInt(text, 10);
        if (!isNaN(num) && num >= 0) {
            setReminderDaysBefore(num);
        }
    };

    const handleTimeChange = (text: string) => {
        setTimeInput(text);
        if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(text)) {
            setReminderTime(text);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
        >
            <ScrollView
                style={[styles.container, { backgroundColor: theme.surfaceAlt }]}
                keyboardShouldPersistTaps="handled"
            >
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

                    <View style={[styles.row, { borderBottomColor: theme.border }]}>
                        <Text style={[styles.label, { color: theme.text }]}>Giờ nhắc</Text>
                        <TextInput
                            style={[styles.input, { color: theme.text, borderColor: theme.border, minWidth: 80 }]}
                            value={timeInput}
                            onChangeText={handleTimeChange}
                            placeholder="HH:mm"
                            maxLength={5}
                            keyboardType="numbers-and-punctuation"
                        />
                    </View>
                </View>



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
                    <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>Gỡ lỗi (Debug)</Text>
                    <TouchableOpacity
                        style={[styles.row, { borderBottomColor: 'transparent' }]}
                        onPress={async () => {
                            try {
                                const id = await scheduleTestNotification();
                                Alert.alert("Thành công", `Đã lên lịch notify (5s): ${id}`);
                            } catch (e) {
                                Alert.alert("Lỗi", "Không thể lên lịch thông báo");
                            }
                        }}
                    >
                        <Text style={[styles.label, { color: theme.text }]}>Test thông báo (5s)</Text>
                        <Ionicons name="notifications-outline" size={20} color={theme.primary} />
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
        </KeyboardAvoidingView>
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
