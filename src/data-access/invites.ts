import { db } from '$/db/db';
import { Invite, InviteStatus, UserRole, invites, users, usersToInventories } from '$/db/schemas';
import { SignupInput } from '$/schemas/auth/signup.schema';
import { AcceptInviteInput } from '$/schemas/invites/accept-invite.schema';
import { and, eq } from 'drizzle-orm';
import { createUser, updateUserInfo } from './users';
import { generateTimestamps } from './utils';

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

			const [invite] = await tx
				.insert(invites)
				.values({
					inventoryId,
					recipientId,
					token,
					senderId,
					...generateTimestamps(),
				})
				.returning();

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

export async function getInviteByToken(token: string) {
	return db.query.invites.findFirst({
		where: (fields, { eq }) => eq(fields.token, token),
		with: {
			inventory: true,
			sender: true,
		},
	});
}

export async function getInventoryInvites(inventoryId: string, inviteStatus: InviteStatus) {
	return db
		.select({
			role: usersToInventories.role,
			invite: invites,
			recipient: users,
		})
		.from(users)
		.innerJoin(invites, eq(invites.recipientId, users.id))
		.innerJoin(
			usersToInventories,
			and(eq(usersToInventories.userId, users.id), eq(usersToInventories.inventoryId, inventoryId)),
		)
		.where(and(eq(invites.inventoryId, inventoryId), eq(invites.status, inviteStatus)))
		.execute();
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
			const { updatedAt } = generateTimestamps();
			const [updated] = await tx
				.update(invites)
				.set({
					token: null,
					status: InviteStatus.ACTIVE,
					updatedAt,
				})
				.where(eq(invites.id, inviteId))
				.returning();

			return updated;
		} catch (error) {
			console.log(`Failed to accept invite. payload: ${JSON.stringify(data)}. error: `, error);
			tx.rollback();
		}
	});
}

export async function declineInvite(id: string) {
	const [invite] = await db.delete(invites).where(eq(invites.id, id)).returning();

	await db
		.delete(usersToInventories)
		.where(
			and(
				eq(usersToInventories.inventoryId, invite.inventoryId),
				eq(usersToInventories.userId, invite.recipientId),
			),
		)
		.execute();

	return invite;
}

export async function getInviteById(id: string) {
	return await db.query.invites
		.findFirst({
			where: (fields, { eq }) => eq(fields.id, id),
		})
		.execute();
}
