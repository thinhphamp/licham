# Phase 3: Alert Time Dropdown

## Context
- Parent: [plan.md](plan.md)
- Target: `src/components/events/EventForm.tsx`
- Depends on: Phase 1, Phase 2

## Overview
- **Priority**: P2
- **Status**: Completed
- **Effort**: 15m

Replace the reminder time TextInput with a Picker dropdown containing 30-minute interval options.

## Current Implementation (lines 367-375)
```tsx
<TextInput
    style={[inputStyle, styles.timeInput]}
    value={reminderTime}
    onChangeText={setReminderTime}
    placeholder="08:00"
    placeholderTextColor={theme.textMuted}
    keyboardType="numbers-and-punctuation"
/>
```

## Implementation Steps

1. **Define time options constant** (near other constants, ~line 28)
2. **Replace TextInput with Picker**
3. **Update styles if needed**

## Code Changes

### Add constant (after REMINDER_DAYS):
```tsx
const REMINDER_TIMES = [
    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30',
    '03:00', '03:30', '04:00', '04:30', '05:00', '05:30',
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
    '21:00', '21:30', '22:00', '22:30', '23:00', '23:30',
];
```

### Replace TextInput with Picker:
```tsx
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
```

### Update reminderOptions layout:
```tsx
<View style={styles.reminderOptions}>
    <View style={styles.reminderRow}>
        <View style={styles.pickerContainer}>
            <Text style={[styles.pickerLabel, { color: theme.textMuted }]}>Nhắc trước</Text>
            {/* Existing days picker */}
        </View>
        <View style={styles.pickerContainer}>
            <Text style={[styles.pickerLabel, { color: theme.textMuted }]}>Giờ nhắc</Text>
            {/* New time picker */}
        </View>
    </View>
</View>
```

### Add style:
```tsx
reminderRow: {
    flexDirection: 'row',
    gap: 12,
},
```

## Related Files
- `src/components/events/EventForm.tsx`

## Success Criteria
- [ ] Time input is a dropdown, not text field
- [ ] Options are 30-min intervals (00:00 to 23:30)
- [ ] Default value "08:00" works correctly
- [ ] Picker matches existing picker styles

## Risk Assessment
- **Low risk** - Replacing input type, same data format
- **Note**: Ensure `reminderTime` state type remains `string` (e.g., "08:00")
