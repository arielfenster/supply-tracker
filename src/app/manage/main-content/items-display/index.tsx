'use client';

import { UserCollections } from '../../actions';

interface ItemsDisplayProps {
	collections: UserCollections;
	selectedCategoryId: string;
	selectedSubcategoryId: string;
}

export function ItemsDisplay({
	collections,
	selectedCategoryId,
	selectedSubcategoryId,
}: ItemsDisplayProps) {
	return <div>Hello from ItemsDisplay</div>;
}
