import { db } from '$/db/db';
import { Invite, invites, usersToInventories } from '$/db/schemas';
import { SignupInput } from '$/schemas/auth/signup.schema';
import { InviteMemberInput } from '$/schemas/inventories/invite-member.schema';
import { AcceptInvitationInput } from '$/schemas/invites/accept-invitation.schema';
import { eq } from 'drizzle-orm';
import { getInventoryMembers } from './inventories';
import { createUser, deleteUser, getUserByEmail, updateUserInfo } from './users';
import { getCurrentTimestamps } from './utils';

type CreateInvitationPayload = SignupInput &
	Pick<InviteMemberInput, 'inventoryId'> &
	Pick<Invite, 'senderId' | 'token'>;

export async function createInvitation(data: CreateInvitationPayload) {
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

	if (existingMember?.status === 'Active') {
		throw new Error(`${email} is already a member of this inventory`);
	} else if (existingMember?.status === 'Pending') {
		throw new Error(`${email} already has a pending invitation`);
	}
}

export async function getInvitationByToken(token: string) {
	return db.query.invites.findFirst({
		where: (fields, { eq }) => eq(fields.token, token),
		with: {
			inventory: true,
			sender: true,
		},
	});
}

export async function getPendingInventoryInvitations(inventoryId: string) {
	return db.query.invites
		.findMany({
			where: (fields, { eq, and }) =>
				and(eq(fields.inventoryId, inventoryId), eq(fields.status, 'Pending')),
			with: {
				recipient: true,
			},
		})
		.execute();
}

export type AcceptInvitationPayload = Pick<AcceptInvitationInput, 'invitationId'> & {
	newUserPassword: string;
};

export async function acceptInvitation(data: AcceptInvitationPayload) {
	const { invitationId, newUserPassword } = data;

	const invitation = await getInvitationById(invitationId);
	if (!invitation) {
		return;
	}

	return db.transaction(async (tx) => {
		try {
			// update user id and password
			await updateUserInfo(
				invitation.recipientId,
				{
					password: newUserPassword,
				},
				tx,
			);

			// update invitation
			const { updatedAt } = getCurrentTimestamps();
			const [invite] = await tx
				.update(invites)
				.set({
					token: null,
					status: 'Active',
					updatedAt,
				})
				.where(eq(invites.id, invitationId))
				.returning();

			return invite;
		} catch (error) {
			console.log(error);
			tx.rollback();
		}
	});
}

export async function declineInvitation(id: string) {
	const invitation = await getInvitationById(id);
	if (!invitation) {
		return;
	}

	// delete the temp user which will also delete the invitation entry
	await deleteUser(invitation.recipientId);
}

async function getInvitationById(id: string) {
	return await db.query.invites
		.findFirst({
			where: (fields, { eq }) => eq(fields.id, id),
		})
		.execute();
}
