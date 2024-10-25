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
import { InviteStatus, UserRole } from '$/db/schemas';
import { getCurrentUser } from '$/lib/auth';
import { InviteMemberInput } from '$/schemas/inventories/invite-member.schema';
import { AcceptInviteInput } from '$/schemas/invites/accept-invite.schema';
import { randomUUID } from 'crypto';
import { nanoid } from 'nanoid';
import { hashPassword } from './auth/password.service';
import { setSessionCookie } from './auth/session.service';
import { sendInviteEmail } from './email.service';
import { generateTempUserId, generateTempUserPassword, isTempUserId } from './users.service';

export async function inviteMemberUseCase(data: InviteMemberInput) {
	const recipient = await assertRecipientNotInventoryMember(data);
	const currentUser = await getCurrentUser();

	// TODO: i dont like this. fix this
	const invite = await createInviteHandler({
		recipientId: recipient?.id ?? generateTempUserId(),
		senderId: currentUser!.id,
		inventoryId: data.inventoryId,
		token: randomUUID(),
		email: data.email,
		password: recipient?.id ? '' : await hashPassword(generateTempUserPassword()),
	});

	// TODO: implement -__-
	if (invite) {
		await sendInviteEmail(invite);
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
