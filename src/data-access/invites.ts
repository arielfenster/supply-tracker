import { db } from '$/db/db';
import { Invite, InviteStatus, UserRole, invites, usersToInventories } from '$/db/schemas';
import { SignupInput } from '$/schemas/auth/signup.schema';
import { AcceptInviteInput } from '$/schemas/invites/accept-invite.schema';
import { eq } from 'drizzle-orm';
import { createUser, deleteUser, updateUserInfo } from './users';
import { getCurrentTimestamps } from './utils';

export type CreateInvitePayload = Partial<SignupInput> &
	Required<Pick<Invite, 'senderId' | 'token' | 'inventoryId' | 'recipientId'>>;

export async function createInvite(data: CreateInvitePayload) {
	const { recipientId, inventoryId, senderId, token, email, password } = data;

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

			const timestamps = getCurrentTimestamps();

			const [invite] = await tx
				.insert(invites)
				.values({
					inventoryId,
					recipientId,
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

export async function getInviteByToken(token: string) {
	return db.query.invites.findFirst({
		where: (fields, { eq }) => eq(fields.token, token),
		with: {
			inventory: true,
			sender: true,
		},
	});
}

export type AcceptInvitePayload = Pick<AcceptInviteInput, 'inviteId'> &
	Pick<Invite, 'recipientId'> & {
		newUserId?: string;
		newUserPassword?: string;
	};

export async function acceptInvite(data: AcceptInvitePayload) {
	const { inviteId, recipientId, newUserId, newUserPassword } = data;

	return db.transaction(async (tx) => {
		try {
			// update user id and password
			if (newUserId && newUserPassword) {
				await updateUserInfo(
					recipientId,
					{
						id: newUserId,
						password: newUserPassword,
					},
					tx,
				);
			}

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
	const [invite] = await db
		.update(invites)
		.set({
			status: InviteStatus.DECLINED,
		})
		.where(eq(invites.id, id))
		.returning();

		return invite;
}

export async function getInviteById(id: string) {
	return await db.query.invites
		.findFirst({
			where: (fields, { eq }) => eq(fields.id, id),
		})
		.execute();
}
