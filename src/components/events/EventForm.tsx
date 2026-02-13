import { useTheme } from '@/constants/theme';
import { lunarToSolar } from '@/services/lunar';
import { useSettingsStore } from '@/stores/settingsStore';
import { DateSystem, EventFormData, RecurrenceConfig, RecurrenceEndType, RecurrenceMode, RecurrenceUnit } from '@/types/event';
import { EventFormDataSchema } from '@/types/schemas';
import { Picker } from '@react-native-picker/picker';
import React, { useMemo, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface EventFormProps {
    initialData?: Partial<EventFormData>;
    onSubmit: (data: EventFormData) => void;
    onCancel: () => void;
}

const LUNAR_DAYS = Array.from({ length: 30 }, (_, i) => i + 1);
const SOLAR_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const LUNAR_MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const currentYear = new Date().getFullYear();
const LUNAR_YEARS = Array.from({ length: 100 }, (_, i) => currentYear - 20 + i);
const REMINDER_DAYS = [0, 1, 2, 3, 7, 14];

// 5-minute interval time options for reminder dropdown
const REMINDER_TIMES = Array.from({ length: 288 }, (_, i) => {
    const hours = Math.floor(i / 12).toString().padStart(2, '0');
    const minutes = ((i % 12) * 5).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
});

const RECURRENCE_UNITS: { label: string; value: RecurrenceUnit }[] = [
    { label: 'Ngày', value: 'day' },
    { label: 'Tuần', value: 'week' },
    { label: 'Tháng', value: 'month' },
    { label: 'Năm', value: 'year' },
];

const DATE_SYSTEMS: { label: string; value: DateSystem }[] = [
    { label: 'Âm lịch', value: 'lunar' },
    { label: 'Dương lịch', value: 'solar' },
];

const RECURRENCE_END_TYPES: { label: string; value: RecurrenceEndType }[] = [
    { label: 'Không bao giờ', value: 'never' },
    { label: 'Vào ngày', value: 'on_date' },
];

export function EventForm({ initialData, onSubmit, onCancel }: EventFormProps) {
    const theme = useTheme();
    const defaultReminderDays = useSettingsStore((s) => s.reminderDaysBefore);
    const defaultReminderTime = useSettingsStore((s) => s.reminderTime);

    const [title, setTitle] = useState(initialData?.title ?? '');
    const [description, setDescription] = useState(initialData?.description ?? '');
    const [lunarDay, setLunarDay] = useState(initialData?.lunarDay ?? 1);
    const [lunarMonth, setLunarMonth] = useState(initialData?.lunarMonth ?? 1);
    const [isLeapMonth, setIsLeapMonth] = useState(initialData?.isLeapMonth ?? false);

    const [reminderEnabled, setReminderEnabled] = useState(
        initialData?.reminderEnabled ?? true
    );
    const [reminderDaysBefore, setReminderDaysBefore] = useState(
        initialData?.reminderDaysBefore ?? defaultReminderDays
    );
    const [reminderTime, setReminderTime] = useState(
        initialData?.reminderTime ?? defaultReminderTime
    );
    const [recurrenceMode, setRecurrenceMode] = useState<RecurrenceMode>(
        initialData?.recurrenceMode ?? (initialData?.lunarYear ? 'single' : 'recurring')
    );
    const [recurrence, setRecurrence] = useState<RecurrenceConfig>(
        initialData?.recurrence ?? { frequency: 1, unit: 'year', system: 'lunar', endType: 'never' }
    );
    const [lunarYear, setLunarYear] = useState(initialData?.lunarYear ?? new Date().getFullYear());

    // Recurrence end date states (Solar)
    const initialEndMatch = initialData?.recurrence?.endDate?.split('-').map(Number);
    const [endDay, setEndDay] = useState(initialEndMatch ? initialEndMatch[2] : new Date().getDate());
    const [endMonth, setEndMonth] = useState(initialEndMatch ? initialEndMatch[1] : new Date().getMonth() + 1);
    const [endYear, setEndYear] = useState(initialEndMatch ? initialEndMatch[0] : new Date().getFullYear() + 1);

    const solarDate = useMemo(() => {
        const result = lunarToSolar(lunarDay, lunarMonth, lunarYear, isLeapMonth);
        if (result.day === 0) return null;
        return result;
    }, [lunarDay, lunarMonth, lunarYear, isLeapMonth]);

    const handleSubmit = () => {
        const formData = {
            title: title.trim(),
            description: description.trim() || undefined,
            lunarDay,
            lunarMonth,
            lunarYear: recurrenceMode === 'single' ? lunarYear : undefined,
            isLeapMonth,
            type: initialData?.type ?? 'personal',
            recurrenceMode,
            recurrence: recurrenceMode === 'recurring' ? {
                ...recurrence,
                endDate: recurrence.endType === 'on_date'
                    ? `${endYear}-${endMonth.toString().padStart(2, '0')}-${endDay.toString().padStart(2, '0')}`
                    : undefined
            } : undefined,
            reminderEnabled,
            reminderDaysBefore,
            reminderTime,
        };

        const result = EventFormDataSchema.safeParse(formData);

        if (!result.success) {
            const error = result.error.issues[0];
            Alert.alert('Lỗi', error.message);
            return;
        }

        onSubmit(result.data as EventFormData);
    };

    const inputStyle = [
        styles.input,
        { borderColor: theme.border, color: theme.text },
    ];

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Title */}
            <View style={styles.field}>
                <Text style={[styles.label, { color: theme.text }]}>Tên sự kiện *</Text>
                <TextInput
                    style={inputStyle}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="VD: Chụp hình gia đình"
                    placeholderTextColor={theme.textMuted}
                />
            </View>

            {/* Description */}
            <View style={styles.field}>
                <Text style={[styles.label, { color: theme.text }]}>Ghi chú</Text>
                <TextInput
                    style={[inputStyle, styles.multiline]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Thêm ghi chú..."
                    placeholderTextColor={theme.textMuted}
                    multiline
                    numberOfLines={3}
                />
            </View>


            {/* Recurrence Mode */}
            <View style={styles.field}>
                <Text style={[styles.label, { color: theme.text }]}>Chế độ lặp</Text>
                <View style={styles.segmentButtons}>
                    <TouchableOpacity
                        style={[
                            styles.segmentButton,
                            { borderColor: theme.border },
                            recurrenceMode === 'single' && { borderColor: theme.primary, backgroundColor: theme.selected },
                        ]}
                        onPress={() => setRecurrenceMode('single')}
                    >
                        <Text
                            style={[
                                styles.segmentText,
                                { color: theme.textSecondary },
                                recurrenceMode === 'single' && { color: theme.primary, fontWeight: '600' },
                            ]}
                        >
                            🗓️ Một lần
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.segmentButton,
                            { borderColor: theme.border },
                            recurrenceMode === 'recurring' && { borderColor: theme.primary, backgroundColor: theme.selected },
                        ]}
                        onPress={() => setRecurrenceMode('recurring')}
                    >
                        <Text
                            style={[
                                styles.segmentText,
                                { color: theme.textSecondary },
                                recurrenceMode === 'recurring' && { color: theme.primary, fontWeight: '600' },
                            ]}
                        >
                            🔄 Lặp lại
                        </Text>
                    </TouchableOpacity>
                </View>

                {recurrenceMode === 'recurring' && (
                    <View style={styles.recurrenceOptions}>
                        <View style={styles.recurrenceRow}>
                            <View style={styles.pickerContainer}>
                                <Text style={[styles.pickerLabel, { color: theme.textMuted }]}>Đơn vị</Text>
                                <View style={[styles.pickerWrapper, { backgroundColor: theme.surface }]}>
                                    <Picker
                                        selectedValue={recurrence.unit}
                                        onValueChange={(val) => setRecurrence({ ...recurrence, unit: val as RecurrenceUnit })}
                                        dropdownIconColor={theme.textSecondary}
                                    >
                                        {RECURRENCE_UNITS.map((u) => (
                                            <Picker.Item key={u.value} label={u.label} value={u.value} color={theme.text} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                            <View style={styles.pickerContainer}>
                                <Text style={[styles.pickerLabel, { color: theme.textMuted }]}>Hệ lịch</Text>
                                <View style={[styles.pickerWrapper, { backgroundColor: theme.surface }]}>
                                    <Picker
                                        selectedValue={recurrence.system}
                                        onValueChange={(val) => setRecurrence({ ...recurrence, system: val as DateSystem })}
                                        dropdownIconColor={theme.textSecondary}
                                    >
                                        {DATE_SYSTEMS.map((s) => (
                                            <Picker.Item key={s.value} label={s.label} value={s.value} color={theme.text} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.recurrenceRow, { marginTop: 12 }]}>
                            <View style={styles.pickerContainer}>
                                <Text style={[styles.pickerLabel, { color: theme.textMuted }]}>Kết thúc lặp</Text>
                                <View style={[styles.pickerWrapper, { backgroundColor: theme.surface }]}>
                                    <Picker
                                        selectedValue={recurrence.endType}
                                        onValueChange={(val) => setRecurrence({ ...recurrence, endType: val as RecurrenceEndType })}
                                        dropdownIconColor={theme.textSecondary}
                                    >
                                        {RECURRENCE_END_TYPES.map((t) => (
                                            <Picker.Item key={t.value} label={t.label} value={t.value} color={theme.text} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                        </View>

                        {recurrence.endType === 'on_date' && (
                            <View style={[styles.dateRow, { marginTop: 12 }]}>
                                <View style={styles.pickerContainer}>
                                    <Text style={[styles.pickerLabel, { color: theme.textMuted }]}>Ngày kết thúc</Text>
                                    <View style={[styles.pickerWrapper, { backgroundColor: theme.surface }]}>
                                        <Picker
                                            selectedValue={endDay}
                                            onValueChange={(val) => setEndDay(Number(val))}
                                            dropdownIconColor={theme.textSecondary}
                                        >
                                            {SOLAR_DAYS.map((d) => (
                                                <Picker.Item key={d} label={`${d}`} value={d} color={theme.text} />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>
                                <View style={styles.pickerContainer}>
                                    <Text style={[styles.pickerLabel, { color: theme.textMuted }]}>Tháng kết thúc</Text>
                                    <View style={[styles.pickerWrapper, { backgroundColor: theme.surface }]}>
                                        <Picker
                                            selectedValue={endMonth}
                                            onValueChange={(val) => setEndMonth(Number(val))}
                                            dropdownIconColor={theme.textSecondary}
                                        >
                                            {LUNAR_MONTHS.map((m) => (
                                                <Picker.Item key={m} label={`${m}`} value={m} color={theme.text} />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>
                                <View style={styles.pickerContainer}>
                                    <Text style={[styles.pickerLabel, { color: theme.textMuted }]}>Năm kết thúc</Text>
                                    <View style={[styles.pickerWrapper, { backgroundColor: theme.surface }]}>
                                        <Picker
                                            selectedValue={endYear}
                                            onValueChange={(val) => setEndYear(Number(val))}
                                            dropdownIconColor={theme.textSecondary}
                                        >
                                            {LUNAR_YEARS.map((y) => (
                                                <Picker.Item key={y} label={`${y}`} value={y} color={theme.text} />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                )}
            </View>

            {/* Solar Date Display - FIRST */}
            {solarDate && (
                <View style={[styles.field, styles.solarDateField]}>
                    <Text style={[styles.label, { color: theme.text, marginBottom: 0 }]}>Ngày dương lịch</Text>
                    <Text style={[styles.solarDateValue, { color: theme.textSecondary }]}>
                        {solarDate.day.toString().padStart(2, '0')}/{solarDate.month.toString().padStart(2, '0')}/{solarDate.year}
                    </Text>
                </View>
            )}

            {/* Lunar Date */}
            <View style={styles.field}>
                <Text style={[styles.label, { color: theme.text }]}>Ngày âm lịch</Text>
                <View style={styles.dateRow}>
                    <View style={styles.pickerContainer}>
                        <Text style={[styles.pickerLabel, { color: theme.textMuted }]}>Ngày</Text>
                        <View style={[styles.pickerWrapper, { backgroundColor: theme.surface }]}>
                            <Picker
                                selectedValue={lunarDay}
                                onValueChange={(val) => setLunarDay(Number(val))}
                                dropdownIconColor={theme.textSecondary}
                            >
                                {LUNAR_DAYS.map((d) => (
                                    <Picker.Item key={d} label={`${d}`} value={d} color={theme.text} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.pickerContainer}>
                        <Text style={[styles.pickerLabel, { color: theme.textMuted }]}>Tháng</Text>
                        <View style={[styles.pickerWrapper, { backgroundColor: theme.surface }]}>
                            <Picker
                                selectedValue={lunarMonth}
                                onValueChange={(val) => setLunarMonth(Number(val))}
                                dropdownIconColor={theme.textSecondary}
                            >
                                {LUNAR_MONTHS.map((m) => (
                                    <Picker.Item key={m} label={`${m}`} value={m} color={theme.text} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    {recurrenceMode === 'single' && (
                        <View style={styles.pickerContainer}>
                            <Text style={[styles.pickerLabel, { color: theme.textMuted }]}>Năm</Text>
                            <View style={[styles.pickerWrapper, { backgroundColor: theme.surface }]}>
                                <Picker
                                    selectedValue={lunarYear}
                                    onValueChange={(val) => setLunarYear(Number(val))}
                                    dropdownIconColor={theme.textSecondary}
                                >
                                    {LUNAR_YEARS.map((y) => (
                                        <Picker.Item key={y} label={`${y}`} value={y} color={theme.text} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    )}
                </View>
            </View>

            {/* Reminder */}
            <View style={styles.field}>
                <View style={styles.switchRow}>
                    <Text style={[styles.label, { color: theme.text }]}>Nhắc nhở</Text>
                    <Switch
                        value={reminderEnabled}
                        onValueChange={setReminderEnabled}
                        trackColor={{ false: theme.border, true: theme.primary }}
                    />
                </View>

                {reminderEnabled && (
                    <View style={styles.reminderOptions}>
                        <View style={styles.reminderRow}>
                            <View style={styles.pickerContainer}>
                                <Text style={[styles.pickerLabel, { color: theme.textMuted }]}>Nhắc trước</Text>
                                <View style={[styles.pickerWrapper, { backgroundColor: theme.surface }]}>
                                    <Picker
                                        selectedValue={reminderDaysBefore}
                                        onValueChange={(val) => setReminderDaysBefore(Number(val))}
                                        dropdownIconColor={theme.textSecondary}
                                    >
                                        {REMINDER_DAYS.map((d) => (
                                            <Picker.Item
                                                key={d}
                                                label={d === 0 ? 'Trong ngày' : `${d} ngày`}
                                                value={d}
                                                color={theme.text}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                            <View style={styles.pickerContainer}>
                                <Text style={[styles.pickerLabel, { color: theme.textMuted }]}>Giờ nhắc</Text>
                                <View style={[styles.pickerWrapper, { backgroundColor: theme.surface }]}>
                                    <Picker
                                        selectedValue={reminderTime}
                                        onValueChange={(val) => setReminderTime(val as string)}
                                        dropdownIconColor={theme.textSecondary}
                                    >
                                        {REMINDER_TIMES.map((time) => (
                                            <Picker.Item
                                                key={time}
                                                label={time}
                                                value={time}
                                                color={theme.text}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </View>

            {/* Buttons */}
            <View style={styles.buttons}>
                <TouchableOpacity
                    style={[styles.cancelButton, { borderColor: theme.border }]}
                    onPress={onCancel}
                >
                    <Text style={[styles.cancelText, { color: theme.textSecondary }]}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.submitButton, { backgroundColor: theme.primary }]}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitText}>Lưu</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    field: {
        marginBottom: 20,
    },
    solarDateField: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    multiline: {
        height: 80,
        textAlignVertical: 'top',
    },
    segmentButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    segmentButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    segmentText: {
        fontSize: 14,
    },
    dateRow: {
        flexDirection: 'row',
        gap: 12,
    },
    pickerContainer: {
        flex: 1,
    },
    pickerLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    pickerWrapper: {
        borderRadius: 8,
        overflow: 'hidden',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    solarDateValue: {
        fontSize: 16,
        fontWeight: '500',
    },
    reminderOptions: {
        marginTop: 12,
    },
    reminderRow: {
        flexDirection: 'row',
        gap: 12,
    },
    buttons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
        marginBottom: 40,
    },
    cancelButton: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 16,
    },
    recurrenceOptions: {
        marginTop: 12,
        padding: 12,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.02)',
    },
    recurrenceRow: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'flex-end',
    },
    submitButton: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitText: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
