import { db } from '$/db/db';
import { User, invites, usersToInventories } from '$/db/schemas';
import { SignupInput } from '$/schemas/auth/signup.schema';
import { InviteMemberInput } from '$/schemas/inventories/invite-member.schema';
import { randomUUID } from 'crypto';
import { createUser } from './users';
import { getCurrentTimestamps } from './utils';

type CreateInvitationInput = SignupInput &
	Pick<InviteMemberInput, 'inventoryId'> &
	Pick<User, 'id'>;

export async function createInvitation(data: CreateInvitationInput) {
	const { id, email, password, inventoryId } = data;

	return db.transaction(async (tx) => {
		const recipient = await createUser({ id, email, password });

		await tx
			.insert(usersToInventories)
			.values({
				inventoryId,
				userId: recipient.id,
				role: 'viewer',
			})
			.execute();

		const timestamps = getCurrentTimestamps();
		const inviteToken = randomUUID();

		const [invite] = await tx
			.insert(invites)
			.values({
				inventoryId,
				recipientId: recipient.id,
				token: inviteToken,
				...timestamps,
			})
			.returning();

		return invite;
	});
}
