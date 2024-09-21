'use server';

import { getUserInventories } from '$/data-access/inventories';
import { formDataToObject, getActionError } from '$/lib/forms';
import { AppRoutes } from '$/lib/redirect';
import { ServerActionState } from '$/lib/types';
import {
	CreateInventoryInput,
	createInventorySchema,
} from '$/schemas/inventory/create-inventory.schema';
import { createInventoryForUser } from '$/services/inventory.service';
import { revalidatePath } from 'next/cache';

export async function getUserInventoriesAction(userId: string) {
	return getUserInventories(userId);
}

export type UserInventoryNew = Awaited<ReturnType<typeof getUserInventoriesAction>>[number];

export async function createInventoryAction(formData: FormData): Promise<ServerActionState> {
	try {
		const data = createInventorySchema.parse(formDataToObject<CreateInventoryInput>(formData));
		await createInventoryForUser(data);

		revalidatePath(AppRoutes.PAGES.DASHBOARD);

		return {
			success: true,
			message: 'Inventory created',
		};
	} catch (error) {
		return {
			success: false,
			error: getActionError(error),
		};
	}
}
