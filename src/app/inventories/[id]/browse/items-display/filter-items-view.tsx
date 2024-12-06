'use client';

import { getCategoryFromId, getSubcategoryFromId } from '$/lib/inventories';
import { Package } from 'lucide-react';
import { ItemsDisplayProps } from '.';
import { ItemsTable } from './items-table';

export function FilterItemsView({
	inventory,
	filter,
	isGlobalFilter,
	selectedCategoryId,
	selectedSubcategoryId,
}: Pick<ItemsDisplayProps, 'inventory'> & { filter: string, isGlobalFilter: boolean, selectedCategoryId: string
	selectedSubcategoryId: string }) {
	const inputRegex = new RegExp(filter, 'i');

	function getFilteredCurrentView() {
		const currentCategory = getCategoryFromId(inventory, selectedCategoryId)!;
		const currentSubcategory = getSubcategoryFromId(currentCategory, selectedSubcategoryId)!;

		const filteredItems = currentSubcategory.items.filter((item) => inputRegex.test(item.name));

		const updatedCategory = filteredItems.length > 0 ? 
			{ ...currentCategory, subcategories: [{ ...currentSubcategory, items: filteredItems }]}
			: null

		return updatedCategory ? [updatedCategory] : [];
	}

	function getFilteredInventory() {
		return inventory.categories
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
	}

	const filteredData = isGlobalFilter ? getFilteredInventory() : getFilteredCurrentView();

	if (filteredData.length === 0) {
		return <div className='m-2 text-xl'>No matching items were found</div>;
	}

	return (
		<>
			{filteredData.map((category) => {
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
						<ItemsTable items={subcategory!.items} inventory={inventory} />
					</div>
				));
			})}
		</>
	);
}
