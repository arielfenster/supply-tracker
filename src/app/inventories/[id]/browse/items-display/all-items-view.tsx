'use comp';

import { UserInventory } from '$/data-access/inventories';
import { Package } from 'lucide-react';
import { AddItemFormContainer } from './add-item-form';
import { ItemsTable } from './items-table';

export interface AllItemsViewProps {
	inventory: UserInventory;
	selectedCategoryId: string;
	selectedSubcategoryId: string;
}

export function AllItemsView({
	inventory,
	selectedCategoryId,
	selectedSubcategoryId,
}: AllItemsViewProps) {
	const category = inventory.categories.find(({ id }) => selectedCategoryId === id);
	const subcategory = category?.subcategories.find(({ id }) => selectedSubcategoryId === id);

	if (!category || !subcategory) {
		return null;
	}

	return (
		<div className='flex flex-col container h-full mt-6 gap-4'>
			<div className='flex items-center'>
				<div className='flex items-center gap-2'>
					<Package className='h-6 w-6' />
					<span className='text-lg'>{category.name}</span>
				</div>
				<span className='text-md opacity-50 ml-2'>/ {subcategory.name}</span>
				<div className='ml-auto'>
					<AddItemFormContainer subcategory={subcategory} />
				</div>
			</div>
			<ItemsTable items={subcategory.items} />
		</div>
	);
}
