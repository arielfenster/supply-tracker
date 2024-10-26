'use server';

import { formDataToObject, getActionError } from '$/lib/forms';
import { AppRoutes, replaceUrlPlaceholder } from '$/lib/redirect';
import { ServerActionState } from '$/lib/types';
import { InviteMemberInput, inviteMemberSchema } from '$/schemas/inventories/invite-member.schema';
import {
	UpdateInventoryInput,
	updateInventorySchema,
} from '$/schemas/inventories/update-inventory.schema';
import {
	UpdateUserRoleInput,
	updateUserRoleSchema,
} from '$/schemas/inventories/update-user-role.schema';
import { updateInventoryUseCase, updateUserRoleUseCase } from '$/services/inventories.service';
import { inviteMemberUseCase } from '$/services/invites.service';
import { revalidatePath } from 'next/cache';

export async function inviteMemberAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = inviteMemberSchema.parse(formDataToObject<InviteMemberInput>(formData));
		await inviteMemberUseCase(data);

		revalidatePath(replaceUrlPlaceholder(AppRoutes.PAGES.INVENTORIES.MANAGE, [data.inventoryId]));

		return {
			success: true,
			message: `Sent an invitation to ${data.email}`,
		};
	} catch (error) {
		return {
			success: false,
			error: getActionError(error),
		};
	}
}

export async function updateUserRoleAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = updateUserRoleSchema.parse(formDataToObject<UpdateUserRoleInput>(formData));
		await updateUserRoleUseCase(data);

		revalidatePath(replaceUrlPlaceholder(AppRoutes.PAGES.INVENTORIES.MANAGE, [data.inventoryId]));

		return {
			success: true,
			message: 'Role updated',
		};
	} catch (error) {
		return {
			success: false,
			error: getActionError(error),
		};
	}
}

export async function updateInventoryAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = updateInventorySchema.parse(formDataToObject<UpdateInventoryInput>(formData));
		await updateInventoryUseCase(data);

		revalidatePath(replaceUrlPlaceholder(AppRoutes.PAGES.INVENTORIES.MANAGE, [data.id]));

		return {
			success: true,
			message: 'Inventory updated',
		};
	} catch (error) {
		return {
			success: false,
			error: getActionError(error),
		};
	}
}
