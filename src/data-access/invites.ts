import { db } from '$/db/db';
import { Invite, invites, usersToInventories } from '$/db/schemas';
import { SignupInput } from '$/schemas/auth/signup.schema';
import { InviteMemberInput } from '$/schemas/inventories/invite-member.schema';
import { AcceptInviteInput } from '$/schemas/invites/accept-invite.schema';
import { eq } from 'drizzle-orm';
import { getInventoryMembers } from './inventories';
import { createUser, deleteUser, getUserByEmail, updateUserInfo } from './users';
import { getCurrentTimestamps } from './utils';

type CreateInvitePayload = SignupInput &
	Pick<InviteMemberInput, 'inventoryId'> &
	Pick<Invite, 'senderId' | 'token'>;

export async function createInvite(data: CreateInvitePayload) {
	await assertRecipientNotAlreadyInInventory(data);

	const { email, password, inventoryId, senderId, token } = data;

	return db.transaction(async (tx) => {
		try {
			const recipient = await createUser({ email, password }, tx);

			await tx
				.insert(usersToInventories)
				.values({
					inventoryId,
					userId: recipient.id,
					role: 'Viewer',
				})
				.execute();

			const timestamps = getCurrentTimestamps();

			const [invite] = await tx
				.insert(invites)
				.values({
					inventoryId,
					recipientId: recipient.id,
					token,
					senderId,
					...timestamps,
				})
				.returning();

			return invite;
		} catch (error) {
			tx.rollback();
		}
	});
}

async function assertRecipientNotAlreadyInInventory(data: InviteMemberInput) {
	const { email, inventoryId } = data;

	const recipient = await getUserByEmail(email);
	if (!recipient) {
		return;
	}

	const inventoryMembers = await getInventoryMembers(inventoryId);
	const existingMember = inventoryMembers.find((member) => member.user.id === recipient.id);

	if (existingMember?.status === 'Active' || existingMember?.role === 'Owner') {
		throw new Error(`${email} is already a member of this inventory`);
	} else if (existingMember?.status === 'Pending') {
		throw new Error(`${email} already has a pending invite`);
	}
}

export async function getInviteByToken(token: string) {
	return db.query.invites.findFirst({
		where: (fields, { eq }) => eq(fields.token, token),
		with: {
			inventory: true,
			sender: true,
		},
	});
}

export type AcceptInvitePayload = Pick<AcceptInviteInput, 'inviteId'> & {
	newUserPassword: string;
};

export async function acceptInvite(data: AcceptInvitePayload) {
	const { inviteId, newUserPassword } = data;

	const invite = await getInviteById(inviteId);
	if (!invite) {
		return;
	}

	return db.transaction(async (tx) => {
		try {
			// update user id and password
			await updateUserInfo(
				invite.recipientId,
				{
					password: newUserPassword,
				},
				tx,
			);

			// update invite
			const { updatedAt } = getCurrentTimestamps();
			const [updated] = await tx
				.update(invites)
				.set({
					token: null,
					status: 'Active',
					updatedAt,
				})
				.where(eq(invites.id, inviteId))
				.returning();

			return updated;
		} catch (error) {
			console.log(error);
			tx.rollback();
		}
	});
}

export async function declineInvite(id: string) {
	const invite = await getInviteById(id);
	if (!invite) {
		return;
	}

	// delete the temp user which will also delete the invite entry
	await deleteUser(invite.recipientId);
}

async function getInviteById(id: string) {
	return await db.query.invites
		.findFirst({
			where: (fields, { eq }) => eq(fields.id, id),
		})
		.execute();
}
