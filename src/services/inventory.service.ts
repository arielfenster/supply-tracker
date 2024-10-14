import { createInventory, updateInventory } from '$/data-access/inventories';
import { getUserIdFromCookie } from '$/lib/auth';
import { CreateInventoryInput } from '$/schemas/inventories/create-inventory.schema';
import { UpdateInventoryInput } from '$/schemas/inventories/update-inventory.schema';

export async function createInventoryForUser({ name }: CreateInventoryInput) {
	const userId = getUserIdFromCookie();
	if (!userId) {
		throw new Error("User not found. Can't create inventory");
	}

	return createInventory({ name, userId });
}

export async function updateInventoryUseCase(data: UpdateInventoryInput) {
	return updateInventory(data);
}
