import { UserRole } from '$/db/schemas';
import { objectValues } from '$/lib/utils';
import { z } from 'zod';

export const updateUserRoleSchema = z.object({
	inventoryId: z.string(),
	userId: z.string(),
	role: z.enum(objectValues(UserRole)),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
