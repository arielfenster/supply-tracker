import { getCategoryById } from '$/data-access/categories';
import {
	CreateInventoryPayload,
	createInventory,
	findUserInventoryWithSimilarName,
	getInventoriesUserIsOwnerOrMemberOf,
	getInventoryMembers,
	updateInventory,
} from '$/data-access/inventories';
import { getSubcategoryById } from '$/data-access/subcategories';
import { Database } from '$/db/db';
import { Category, Item, Subcategory, UserRole } from '$/db/schemas';
import { getUserIdFromCookie } from '$/lib/auth';
import { CreateInventoryInput } from '$/schemas/inventories/create-inventory.schema';
import { UpdateInventoryInput } from '$/schemas/inventories/update-inventory.schema';
import { isCategory } from './categories.service';
import { isItem } from './items.service';
import { isSubcategory } from './subcategories.service';

export async function createInventoryForUser({ name }: CreateInventoryInput) {
	const userId = getUserIdFromCookie();
	if (!userId) {
		throw new Error("User not found. Can't create inventory");
	}

	const payload: CreateInventoryPayload = { name, ownerId: userId };

	await assertUniqueInventoryNameForUser(payload);
	return createInventory(payload);
}

async function assertUniqueInventoryNameForUser(data: CreateInventoryPayload) {
	const existingUserInventoriesWithSameName = await findUserInventoryWithSimilarName(data);

	if (existingUserInventoriesWithSameName.length) {
		throw new Error(`Inventory ${data.name} already exists`);
	}
}

export async function getMembersForInventory(id: string) {
	const members = await getInventoryMembers(id);

	if (members.length === 0) {
		return [];
	}

	// moving the owner object to the start of the array
	const ownerIndex = members.findIndex((members) => members.role === UserRole.OWNER);
	const [owner] = members.splice(ownerIndex, 1);
	members.unshift(owner);

	return members;
}

export async function isUserEligibleToViewInventory(inventoryId: string, userId: string) {
	const members = await getInventoryMembers(inventoryId);

	return !!members.find((member) => member.user.id === userId);
}

export async function updateInventoryUseCase(data: UpdateInventoryInput) {
	return updateInventory(data);
}

export type InventoryWithOwner = Awaited<
	ReturnType<typeof getInventoriesUserIsEligibleToView>
>[number];

export async function getInventoriesUserIsEligibleToView(userId: string) {
	const data = await getInventoriesUserIsOwnerOrMemberOf(userId);

	// placing the user-owned inventories first
	return data
		.sort((a, b) => {
			const isUserOwnerOfA = a.owner.id === userId ? 0 : 1;
			const isUserOwnerOfB = b.owner.id === userId ? 0 : 1;

			return isUserOwnerOfA - isUserOwnerOfB;
		})
		.map((item) => ({
			...item.inventory,
			owner: item.owner,
		}));
}

export async function updateInventoryFromEntity(
	entity: Item | Subcategory | Category,
	tx: Database,
) {
	let inventoryId: string | null = null;

	if (isItem(entity)) {
		const subcategory = await getSubcategoryById(entity.subcategoryId);
		if (subcategory) {
			const category = await getCategoryById(subcategory.categoryId);
			inventoryId = category?.inventoryId || null;
		}
	} else if (isSubcategory(entity)) {
		const category = await getCategoryById(entity.categoryId);
		inventoryId = category?.inventoryId || null;
	} else if (isCategory(entity)) {
		inventoryId = entity.inventoryId;
	}

	if (inventoryId) {
		return updateInventory({ id: inventoryId }, tx);
	} else {
		console.error(`Could not find inventory id for entity ${entity.id}, ${entity.name}`);
	}
}
