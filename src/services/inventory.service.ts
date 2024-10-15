import {
	CreateInventoryPayload,
	assertUniqueInventoryNameForUser,
	createInventory,
	getInventoryMembers,
	updateInventory,
} from '$/data-access/inventories';
import { InviteStatus, UserRole } from '$/db/schemas';
import { getUserIdFromCookie } from '$/lib/auth';
import { CreateInventoryInput } from '$/schemas/inventories/create-inventory.schema';
import { UpdateInventoryInput } from '$/schemas/inventories/update-inventory.schema';

export async function createInventoryForUser({ name }: CreateInventoryInput) {
	const userId = getUserIdFromCookie();
	if (!userId) {
		throw new Error("User not found. Can't create inventory");
	}

	const payload: CreateInventoryPayload = { name, ownerId: userId };

	await assertUniqueInventoryNameForUser(payload);
	return createInventory(payload);
}

export async function getMembersForInventory(id: string) {
	const members = await getInventoryMembers(id);

	if (members.length === 0) {
		return [];
	}

	// moving the owner object to the start of the array
	const ownerIndex = members.findIndex((members) => members.role === 'Owner');
	const [owner] = members.splice(ownerIndex, 1);
	members.unshift(owner);

	return members;
}

export async function isUserAllowedToSeeInventory(inventoryId: string, userId: string) {
	const members = await getInventoryMembers(inventoryId);

	const user = members.find((member) => member.user.id === userId);
	return user?.role === UserRole.OWNER || user?.status === InviteStatus.ACTIVE;
}

export async function updateInventoryUseCase(data: UpdateInventoryInput) {
	return updateInventory(data);
}
