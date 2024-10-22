'use server';

import { formDataToObject, getActionError } from '$/lib/forms';
import { AppRoutes } from '$/lib/redirect';
import { ServerActionState } from '$/lib/types';
import {
	CreateInventoryInput,
	createInventorySchema,
} from '$/schemas/inventories/create-inventory.schema';
import { createInventoryForUser } from '$/services/inventories.service';
import { revalidatePath } from 'next/cache';

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
