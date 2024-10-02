import { measurementUnits } from '$/db/schemas';
import { z } from 'zod';

export const createItemSchema = z
	.object({
		name: z.string().min(1, { message: 'Name must not be empty' }),
		measurement: z.enum(measurementUnits),
		quantity: z.string().transform((val) => val || '0'),
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

		if (measurement !== 'custom' && Number.isNaN(Number(quantity))) {
			ctx.addIssue({
				code: 'custom',
				path: ['quantity'],
				message: 'For non-custom measurements, quantity must be non-negative number',
			});
		}

		if (warningThreshold < dangerThreshold) {
			ctx.addIssue({
				code: 'custom',
				path: ['dangerThreshold'],
				message: 'Danger threshold cannot be higher than warning threshold',
			});
		}
	});

export type CreateItemInput = z.infer<typeof createItemSchema>;
