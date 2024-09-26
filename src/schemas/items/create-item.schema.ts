import { measurementUnits } from '$/db/schemas';
import { z } from 'zod';

export const createItemSchema = z
	.object({
		name: z.string().min(1, { message: 'Name must not be empty' }),
		measurement: z.enum(measurementUnits),
		quantity: z.string(),
		warningThreshold: z.coerce
			.number()
			.gte(0, { message: 'Warning threshold must be non-negative number' }),
		dangerThreshold: z.coerce
			.number()
			.gte(0, { message: 'Danger threshold must be non-negative number' }),
		subcategoryId: z.string(),
	})
	.superRefine((values, ctx) => {
		const { measurement, quantity, warningThreshold, dangerThreshold } = values;

		if (measurement !== 'custom' && !parseInt(quantity, 10)) {
			ctx.addIssue({
				code: 'custom',
				path: ['quantity'],
				message: 'For regular measurements, quantity must be non-negative number',
			});
		}

		if (warningThreshold < dangerThreshold) {
			ctx.addIssue({
				code: 'custom',
				path: ['warningThreshold'],
				message: 'Warning threshold cannot be lower than danger threshold',
			});
		}
	});

export type CreateItemInput = z.infer<typeof createItemSchema>;
