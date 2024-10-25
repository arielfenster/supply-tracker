import { db } from '$/db/db';
import { Invite, InviteStatus, UserRole, usersToInventories } from '$/db/schemas';
import { SignupInput } from '$/schemas/auth/signup.schema';
import { AcceptInviteInput } from '$/schemas/invites/accept-invite.schema';
import { isTempUserId } from '$/services/users.service';
import { and, eq } from 'drizzle-orm';
import {
	createInvite,
	deleteInvite,
	findInviteByToken,
	getInventoryInvites,
	getInviteById,
	markInviteAsActive,
} from '../atomic/invites.atomic';
import { createUser, deleteUser, updateUser } from '../atomic/users.atomic';

export type CreateInvitePayload = Partial<SignupInput> &
	Required<Pick<Invite, 'senderId' | 'token' | 'inventoryId' | 'recipientId'>>;

export async function createInviteHandler(data: CreateInvitePayload) {
	const { recipientId, inventoryId, email, password } = data;

	return db.transaction(async (tx) => {
		try {
			if (email && password) {
				await createUser({ id: recipientId, email, password }, tx);
			}

			await tx
				.insert(usersToInventories)
				.values({
					inventoryId,
					userId: recipientId,
					role: UserRole.VIEWER,
				})
				.execute();

			const invite = await createInvite(data, tx);

			return tx.query.invites.findFirst({
				where: (fields, { eq }) => eq(fields.id, invite.id),
				with: {
					sender: true,
					recipient: true,
				},
			});
		} catch (error) {
			console.error(`Failed to create invite. payload: ${JSON.stringify(data)}. error: `, error);
			tx.rollback();
		}
	});
}

export async function findInviteByTokenHandler(token: string) {
	return findInviteByToken(token, db);
}

export async function getInventoryInvitesHandler(inventoryId: string, inviteStatus: InviteStatus) {
	return getInventoryInvites(inventoryId, inviteStatus, db);
}

export type AcceptInvitePayload = Pick<AcceptInviteInput, 'inviteId'> &
	Pick<Invite, 'recipientId'> & {
		newUserId?: string;
		newUserPassword?: string;
	};

export async function acceptInviteHandler(data: AcceptInvitePayload) {
	const { inviteId, recipientId, newUserId, newUserPassword } = data;

	return db.transaction(async (tx) => {
		try {
			// update user id and password
			if (newUserId && newUserPassword) {
				await updateUser(
					recipientId,
					{
						id: newUserId,
						password: newUserPassword,
					},
					tx,
				);
			}
			return markInviteAsActive(inviteId, tx);
		} catch (error) {
			console.error(`Failed to accept invite. payload: ${JSON.stringify(data)}. error: `, error);
			tx.rollback();
		}
	});
}

export async function declineInviteHandler(id: string) {
	return db.transaction(async (tx) => {
		try {
			const invite = await deleteInvite(id, tx);

			await tx
				.delete(usersToInventories)
				.where(
					and(
						eq(usersToInventories.inventoryId, invite.inventoryId),
						eq(usersToInventories.userId, invite.recipientId),
					),
				)
				.execute();

			const isNewUser = isTempUserId(invite.recipientId);
			if (isNewUser) {
				await deleteUser(invite.recipientId, tx);
			}
			return invite;
		} catch (error) {
			console.error(`Failed to decline invite. payload: ${JSON.stringify({ id })}. error: `, error);
			tx.rollback();
		}
	});
}

export async function getInviteByIdHandler(id: string) {
	return getInviteById(id, db);
}
