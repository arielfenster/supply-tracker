import { Database, db } from '$/db/db';
import { Category, Item, Subcategory, UserRole, usersToInventories } from '$/db/schemas';
import { UpdateInventoryInput } from '$/schemas/inventories/update-inventory.schema';
import {
	createInventory,
	findUserInventoryWithSimilarName,
	getInventoriesUserIsOwnerOrMemberOf,
	getInventoryById,
	getInventoryMembers,
	getItemQuantitiesForInventory,
	getTotalItemsCountForInventory,
	updateInventory,
} from '../atomic/inventories.atomic';
import { getCategoryByIdHandler, isCategory } from './categories.handler';
import { isItem } from './items.handler';
import { getSubcategoryByIdHandler, isSubcategory } from './subcategories.handler';

export type UserInventory = NonNullable<Awaited<ReturnType<typeof getInventoryByIdHandler>>>;
export type InventoryMember = Awaited<ReturnType<typeof getInventoryMembersHandler>>[number];

export type CreateInventoryPayload = { name: string; ownerId: string };
export type UpdateInventoryPayload = Pick<UpdateInventoryInput, 'id'> &
	Partial<Pick<UpdateInventoryInput, 'name'>>;

export async function getInventoryByIdHandler(inventoryId: string) {
	return getInventoryById(inventoryId, db);
}

/**
 * Returns the list of inventories the user is:
 * 1. owner of
 * 2. a strict member of (not an owner)
 */
export async function getInventoriesUserIsOwnerOrMemberOfHandler(userId: string) {
	return getInventoriesUserIsOwnerOrMemberOf(userId, db);
}

/**
 * Returns a list of:
 * 1. The inventory owner
 * 2. All users that are invited/have been invited to this inventory and accepted
 */
export async function getInventoryMembersHandler(inventoryId: string) {
	return getInventoryMembers(inventoryId, db);
}

export async function findUserInventoryWithSimilarNameHandler(data: CreateInventoryPayload) {
	return findUserInventoryWithSimilarName(data, db);
}

export async function createInventoryHandler(data: CreateInventoryPayload) {
	return db.transaction(async (tx) => {
		try {
			const inventory = await createInventory(data, tx);
			await tx
				.insert(usersToInventories)
				.values({ userId: data.ownerId, inventoryId: inventory.id, role: UserRole.OWNER })
				.execute();

			return inventory;
		} catch (error) {
			console.error(`Failed to create inventory. payload: ${JSON.stringify(data)}. error: `, error);
			tx.rollback();
		}
	});
}

export async function updateInventoryHandler(data: UpdateInventoryPayload) {
	return updateInventory(data.id, data, db);
}

export async function getTotalItemsCountForInventoryHandler(inventoryId: string) {
	return getTotalItemsCountForInventory(inventoryId, db);
}

export async function getItemQuantitiesForInventoryHandler(inventoryId: string) {
	return getItemQuantitiesForInventory(inventoryId, db);
}

export async function updateInventoryFromEntityHandler(
	entity: Item | Subcategory | Category,
	tx: Database,
) {
	let inventoryId: string | null = null;

	if (isItem(entity)) {
		const subcategory = await getSubcategoryByIdHandler(entity.subcategoryId);
		if (subcategory) {
			const category = await getCategoryByIdHandler(subcategory.categoryId);
			inventoryId = category?.inventoryId || null;
		}
	} else if (isSubcategory(entity)) {
		const category = await getCategoryByIdHandler(entity.categoryId);
		inventoryId = category?.inventoryId || null;
	} else if (isCategory(entity)) {
		inventoryId = entity.inventoryId;
	}

	if (inventoryId) {
		return updateInventory(inventoryId, {}, tx);
	} else {
		console.error(`Could not find inventory id for entity ${entity.id}, ${entity.name}`);
	}
}
