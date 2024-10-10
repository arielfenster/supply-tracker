import { z } from 'zod';

export const inviteMemberSchema = z.object({
	email: z.string().email().toLowerCase(),
	inventoryId: z.string(),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
