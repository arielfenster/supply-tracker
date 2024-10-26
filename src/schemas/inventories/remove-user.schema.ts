import { z } from 'zod';
import { updateUserRoleSchema } from './update-user-role.schema';

export const removeUserFromInventorySchema = updateUserRoleSchema.pick({
	inventoryId: true,
	userId: true,
});

export type RemoveUserFromInventoryInput = z.infer<typeof removeUserFromInventorySchema>;
