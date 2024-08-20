'use server';

import { getUserCollections } from '$/data-access/users';

export async function getUserCollectionsAction(userId: string) {
	return getUserCollections(userId);
}
