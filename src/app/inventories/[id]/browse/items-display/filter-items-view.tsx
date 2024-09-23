'use client';

import { UserInventory } from '$/data-access/inventories';
import { Package } from 'lucide-react';
import { ItemsTable } from './items-table';

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

	if (filteredInventory.length === 0) {
		return <div className='m-2 text-xl'>No matching items were found</div>;
	}

	return (
		<>
			{filteredInventory.map((category) => {
				return category!.subcategories.map((subcategory) => (
					<div
						key={`${category!.id}-${subcategory!.id}`}
						className='flex flex-col container my-6 gap-4'
					>
						<div className='flex items-center'>
							<div className='flex items-center gap-2'>
								<Package className='h-6 w-6' />
								<span className='text-lg'>{category!.name}</span>
							</div>
							<span className='text-md opacity-50 ml-2'>/ {subcategory!.name}</span>
						</div>
						<ItemsTable items={subcategory!.items} />
					</div>
				));
			})}
		</>
	);
}
