import { weekDays } from '$/db/schemas';
import { z } from 'zod';

export const updateUserNotificationsSchema = z
	.object({
		id: z.string(),
		notificationsDay: z.enum(weekDays, { message: 'Day must be a valid day of the week' }),
		notificationsTime: z.string(),
	})
	.refine(({ notificationsTime }) => notificationsTime.match(/^\d\d:\d\d$/), {
		path: ['notificationsTime'],
		message: 'Time must be in format HH:MM',
	})
	.refine(
		({ notificationsTime }) => {
			const [hours, minutes] = notificationsTime.split(':');

			const intHours = parseInt(hours, 10);
			const intMinutes = parseInt(minutes, 10);

			return intHours < 24 && intMinutes >= 0;
		},
		{
			path: ['notificationsTime'],
			message: 'Time must represent valid 24 hours format',
		},
	);

export type UpdateUserNotificationsInput = z.infer<typeof updateUserNotificationsSchema>;
