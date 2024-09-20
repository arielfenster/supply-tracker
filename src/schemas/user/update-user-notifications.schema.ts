import { weekDays } from '$/db/schemas';
import { z } from 'zod';

export const updateUserNotificationsSchema = z
	.object({
		id: z.string(),
		day: z.enum(weekDays, { message: 'Day must be a valid day of the week' }),
		time: z.string(),
	})
	.refine(({ time }) => time.match(/^\d\d:\d\d$/), { message: 'Time must be in format HH:MM' })
	.refine(
		({ time }) => {
			const [hours, minutes] = time.split(':');

			const intHours = parseInt(hours, 10);
			const intMinutes = parseInt(minutes, 10);

			return intHours < 24 && intMinutes >= 0;
		},
		{ message: 'Time must represent valid 24 hours format' },
	);

export type UpdateUserNotificationsInput = z.infer<typeof updateUserNotificationsSchema>;
