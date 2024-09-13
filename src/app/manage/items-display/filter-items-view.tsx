'use client';

import { Item, Subcategory } from '$/db/schemas';
import { UserInventory } from '../actions';

export function FilterItemsView({
	inventory,
	filter,
}: {
	inventory: UserInventory;
	filter: string;
}) {
	const inputRegex = new RegExp(filter, 'i');

	const filteredInventory = inventory.categories
		.map((category) => {
			const filteredSubcategories = category.subcategories
				.map((subcategory) => {
					const filteredItems = subcategory.items.filter((item) => inputRegex.test(item.name));

					return filteredItems.length > 0 ? { ...subcategory, items: filteredItems } : null;
				})
				.filter(Boolean);

			return filteredSubcategories.length > 0
				? { ...category, subcategories: filteredSubcategories }
				: null;
		})
		.filter(Boolean);

	console.log(filteredInventory);

	return <div>hi</div>;
}
