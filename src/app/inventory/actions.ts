'use server';

import { getUserInventory } from '$/data-access/items';

export async function getUserInventoryAction(userId: string) {
	return getUserInventory(userId);
}

export type UserInventory = Awaited<ReturnType<typeof getUserInventory>>;
