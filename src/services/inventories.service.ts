import {
	CreateInventoryPayload,
	createInventoryHandler,
	findUserInventoryWithSimilarNameHandler,
	getInventoriesUserIsOwnerOrMemberOfHandler,
	getInventoryMembersHandler,
	removeUserFromInventoryHandler,
	updateInventoryHandler,
	updateUserRoleHandler,
} from '$/data-access/handlers/inventories.handler';
import { UserRole } from '$/db/schemas';
import { isManageInventoryRole } from '$/lib/inventories';
import { CreateInventoryInput } from '$/schemas/inventories/create-inventory.schema';
import { RemoveUserFromInventoryInput } from '$/schemas/inventories/remove-user.schema';
import { UpdateInventoryInput } from '$/schemas/inventories/update-inventory.schema';
import { UpdateUserRoleInput } from '$/schemas/inventories/update-user-role.schema';
import { getUserIdFromCookie } from './auth/session.service';

export type InventoryWithOwner = Awaited<
	ReturnType<typeof getInventoriesUserIsEligibleToView>
>[number];

export async function createInventoryForUser({ name }: CreateInventoryInput) {
	const userId = getUserIdFromCookie();
	if (!userId) {
		throw new Error("User not found. Can't create inventory");
	}

	const payload: CreateInventoryPayload = { name, ownerId: userId };

	await assertUniqueInventoryNameForUser(payload);
	return createInventoryHandler(payload);
}

async function assertUniqueInventoryNameForUser(data: CreateInventoryPayload) {
	const existingUserInventoriesWithSameName = await findUserInventoryWithSimilarNameHandler(data);

	if (existingUserInventoriesWithSameName.length) {
		throw new Error(`Inventory ${data.name} already exists`);
	}
}

export async function getMembersForInventory(id: string) {
	const members = await getInventoryMembersHandler(id);

	if (members.length === 0) {
		return [];
	}

	// moving the owner object to the start of the array
	const ownerIndex = members.findIndex((members) => members.role === UserRole.OWNER);
	const [owner] = members.splice(ownerIndex, 1);
	members.unshift(owner);

	return members;
}

export async function isUserEligibleToManageInventory(inventoryId: string, userId: string) {
	const members = await getInventoryMembersHandler(inventoryId);
	const user = members.find((member) => member.user.id === userId);

	return isManageInventoryRole(user?.role);
}

export async function updateInventoryUseCase(data: UpdateInventoryInput) {
	return updateInventoryHandler(data);
}

export async function getInventoriesUserIsEligibleToView(userId: string) {
	const data = await getInventoriesUserIsOwnerOrMemberOfHandler(userId);

	// placing the user-owned inventories first
	return data
		.sort((a, b) => {
			const isUserOwnerOfA = a.owner.id === userId ? 0 : 1;
			const isUserOwnerOfB = b.owner.id === userId ? 0 : 1;

			return isUserOwnerOfA - isUserOwnerOfB;
		})
		.map((item) => ({
			...item.inventory,
			role: item.role,
			owner: item.owner,
		}));
}

export async function updateUserRoleUseCase(data: UpdateUserRoleInput) {
	return updateUserRoleHandler(data);
}

export async function removeUserFromInventoryUseCase(data: RemoveUserFromInventoryInput) {
	return removeUserFromInventoryHandler(data);
}
