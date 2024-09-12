import { z } from 'zod';

export const createItemSchema = z
	.object({
		name: z.string().min(1, { message: 'Name must not be empty' }),
		quantity: z.coerce.number().gte(0, { message: 'Quantity must be non-negative number' }),
		warningThreshold: z.coerce
			.number()
			.gte(0, { message: 'Warning threshold must be non-negative number' }),
		dangerThreshold: z.coerce
			.number()
			.gte(0, { message: 'Danger threshold must be non-negative number' }),
		subcategoryId: z.string(),
	})
	.superRefine((values, ctx) => {
		const { warningThreshold, dangerThreshold } = values;

		if (warningThreshold < dangerThreshold) {
			ctx.addIssue({
				code: 'custom',
				path: ['warningThreshold'],
				message: 'Warning threshold cannot be lower than danger threshold',
			});
		}
	});
