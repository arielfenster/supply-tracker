import { createInventory } from '$/data-access/inventories';
import { getUserIdFromCookie } from '$/lib/auth';
import { CreateInventoryInput } from '$/schemas/inventories/create-inventory.schema';

export async function createInventoryForUser({ name }: CreateInventoryInput) {
	const userId = getUserIdFromCookie();
	if (!userId) {
		throw new Error("User not found. Can't create inventory");
	}

	return createInventory({ name, userId });
}
