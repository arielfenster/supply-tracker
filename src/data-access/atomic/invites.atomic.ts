import { Database } from '$/db/db';
import { Invite, InviteStatus, NewInvite, invites, users, usersToInventories } from '$/db/schemas';
import { AcceptInviteInput } from '$/schemas/invites/accept-invite.schema';
import { and, eq } from 'drizzle-orm';
import { generateTimestamps } from '../utils';

export async function createInvite(data: NewInvite, db: Database) {
	const { recipientId, inventoryId, senderId, token } = data;

	const [invite] = await db
		.insert(invites)
		.values({
			inventoryId,
			recipientId,
			token,
			senderId,
			...generateTimestamps(),
		})
		.returning();

	return invite;
}

export async function findInviteByToken(token: string, db: Database) {
	return db.query.invites.findFirst({
		where: (fields, { eq }) => eq(fields.token, token),
		with: {
			inventory: true,
			sender: true,
		},
	});
}

export async function getInventoryInvites(
	inventoryId: string,
	inviteStatus: InviteStatus,
	db: Database,
) {
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

export async function markInviteAsActive(id: string, db: Database) {
	const { updatedAt } = generateTimestamps();
	const [updated] = await db
		.update(invites)
		.set({
			token: null,
			status: InviteStatus.ACTIVE,
			updatedAt,
		})
		.where(eq(invites.id, id))
		.returning();

	return updated;
}

export async function deleteInvite(id: string, db: Database) {
	const [invite] = await db.delete(invites).where(eq(invites.id, id)).returning();

	return invite;
}

export async function getInviteById(id: string, db: Database) {
	return db.query.invites
		.findFirst({
			where: (fields, { eq }) => eq(fields.id, id),
		})
		.execute();
}

export async function findInviteForUser(
	data: { inventoryId: string; userId: string },
	db: Database,
) {
	return db.query.invites
		.findFirst({
			where: (fields, { and, eq }) =>
				and(eq(fields.inventoryId, data.inventoryId), eq(fields.recipientId, data.userId)),
		})
		.execute();
}
