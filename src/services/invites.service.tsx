import { getInventoryMembersHandler } from '$/data-access/handlers/inventories.handler';
import {
	AcceptInvitePayload,
	acceptInviteHandler,
	createInviteHandler,
	declineInviteHandler,
	getInventoryInvitesHandler,
	getInviteByIdHandler,
} from '$/data-access/handlers/invites.handler';
import { getUserByEmailHandler } from '$/data-access/handlers/users.handler';
import { InviteStatus, User, UserRole } from '$/db/schemas';
import { InviteEmail } from '$/emails/invite-email';
import { getCurrentUser } from '$/lib/auth';
import { InviteMemberInput } from '$/schemas/inventories/invite-member.schema';
import { AcceptInviteInput } from '$/schemas/invites/accept-invite.schema';
import { randomUUID } from 'crypto';
import { nanoid } from 'nanoid';
import { hashPassword } from './auth/password.service';
import { setSessionCookie } from './auth/session.service';
import { sendEmail } from './email.service';
import { generateTempUserId, generateTempUserPassword, isTempUserId } from './users.service';

export async function inviteMemberUseCase(data: InviteMemberInput) {
	const recipient = await assertRecipientNotInventoryMember(data);
	const sender = (await getCurrentUser())!;
	const invite = recipient
		? await createInviteForExistingUser(data, sender, recipient)
		: await createInviteForNewUser(data, sender);

	if (invite) {
		await sendEmail({
			to: invite.recipient.email,
			subject: "You're invited to collaborate on an inventory",
			body: <InviteEmail invite={invite} />
		});
	}
}

async function assertRecipientNotInventoryMember(data: InviteMemberInput) {
	const { email, inventoryId } = data;

	const recipient = await getUserByEmailHandler(email);
	if (!recipient) {
		return;
	}

	const inventoryMembers = await getInventoryMembersHandler(inventoryId);
	const existingMember = inventoryMembers.find((member) => member.user.id === recipient.id);

	if (existingMember?.status === InviteStatus.ACTIVE || existingMember?.role === UserRole.OWNER) {
		throw new Error(`${email} is already a member of this inventory`);
	} else if (existingMember?.status === InviteStatus.PENDING) {
		throw new Error(`${email} already has a pending invite`);
	}

	return recipient;
}

async function createInviteForExistingUser(data: InviteMemberInput, sender: User, recipient: User) {
	return createInviteHandler({
		recipientId: recipient.id,
		senderId: sender.id,
		inventoryId: data.inventoryId,
		token: randomUUID(),
	});
}

async function createInviteForNewUser(data: InviteMemberInput, sender: User) {
	return createInviteHandler({
		recipientId: generateTempUserId(),
		senderId: sender.id,
		inventoryId: data.inventoryId,
		token: randomUUID(),
		email: data.email,
		password: await hashPassword(generateTempUserPassword()),
	});
}

export async function declineInviteUseCase(inviteId: string) {
	const invite = await getInviteByIdHandler(inviteId);
	if (!invite) {
		return;
	}

	await declineInviteHandler(inviteId);
}

export async function acceptInviteUseCase(data: AcceptInviteInput) {
	const { inviteId, password } = data;

	const invite = await getInviteByIdHandler(inviteId);
	if (!invite) {
		return;
	}

	const payload: AcceptInvitePayload = {
		inviteId: invite.id,
		recipientId: invite.recipientId,
	};

	const isNewUser = isTempUserId(invite.recipientId);
	if (isNewUser) {
		payload.newUserId = nanoid();
		payload.newUserPassword = await hashPassword(password!);
	}

	await acceptInviteHandler(payload);

	setSessionCookie(isNewUser ? payload.newUserId! : payload!.recipientId);
}

export async function getPendingInventoryInvites(inventoryId: string) {
	return getInventoryInvitesHandler(inventoryId, InviteStatus.PENDING);
}
