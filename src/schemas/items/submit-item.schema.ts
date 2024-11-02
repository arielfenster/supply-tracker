import { measurementUnits } from '$/db/schemas';
import { z } from 'zod';

export const submitItemSchema = z
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
		id: z.string().optional(),
	})
	.superRefine((values, ctx) => {
		const { measurement, quantity, warningThreshold, dangerThreshold } = values;

		const quantityNumber = Number(quantity);
		const isValidQuantity = !Number.isNaN(quantityNumber) && quantityNumber >= 0;

		if (measurement !== 'Custom' && !isValidQuantity) {
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

export type SubmitItemInput = z.infer<typeof submitItemSchema>;

export type CreateItemInput = Omit<SubmitItemInput, 'id'>;
export type UpdateItemInput = Required<SubmitItemInput>;
