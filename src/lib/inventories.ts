import { UserInventory } from '$/data-access/handlers/inventories.handler';
import { UserRole } from '$/db/schemas';

export function isManageInventoryRole(role?: UserRole) {
	return role === UserRole.OWNER || role === UserRole.EDITOR;
}

export function getCategoryFromId(inventory: UserInventory, categoryId: string) {
	return inventory.categories.find((category) => category.id === categoryId);
}

export function getSubcategoryFromId(
	category: UserInventory['categories'][number],
	subcategoryId: string,
) {
	return category.subcategories.find((subcategory) => subcategory.id === subcategoryId)!;
}

export function getCategoryFromName(inventory: UserInventory, categoryName: string) {
	return inventory.categories.find((category) => category.name === categoryName);
}

export function getSubcategoryFromName(
	category: UserInventory['categories'][number],
	subcategoryName: string,
) {
	return category.subcategories.find((subcategory) => subcategory.name === subcategoryName);
}
