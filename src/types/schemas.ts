import { z } from 'zod';

export const RecurrenceConfigSchema = z.object({
    frequency: z.number().int().positive(),
    unit: z.enum(['day', 'week', 'month', 'year']),
    system: z.enum(['solar', 'lunar']),
});

export const EventTypeSchema = z.enum(['gio', 'holiday', 'personal']);
export const RecurrenceModeSchema = z.enum(['single', 'recurring']);

export const EventFormDataSchema = z.object({
    title: z.string().min(1, 'Tiêu đề không được để trống').max(100),
    description: z.string().optional(),
    lunarDay: z.number().int().min(1).max(31),
    lunarMonth: z.number().int().min(1).max(12),
    lunarYear: z.number().int().min(1900).max(2100).optional(),
    isLeapMonth: z.boolean(),
    type: EventTypeSchema,
    recurrenceMode: RecurrenceModeSchema,
    recurrence: RecurrenceConfigSchema.optional(),
    reminderEnabled: z.boolean(),
    reminderDaysBefore: z.number().int().min(0).max(30),
    reminderTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Giờ không hợp lệ'),
    color: z.string().optional(),
}).refine((data) => {
    if (data.recurrenceMode === 'recurring' && !data.recurrence) {
        return false;
    }
    return true;
}, {
    message: "Cấu hình lặp lại là bắt buộc cho chế độ lặp lại",
    path: ["recurrence"],
});

export type EventFormDataInput = z.infer<typeof EventFormDataSchema>;
