'use comp';

import { Package } from 'lucide-react';
import { UserInventory } from '../actions';
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
		<div className='flex flex-col container mt-4 h-full gap-6'>
			<div className='flex items-center gap-2'>
				<div className='flex items-center gap-2'>
					<Package className='h-6 w-6' />
					<span className='text-lg'>{category.name}</span>
				</div>
				<div>
					<span className='text-md opacity-50'>/ {subcategory.name}</span>
				</div>
				<div className='flex gap-2 ml-auto'>
					<AddItemFormContainer subcategoryId={subcategory.id} />
				</div>
			</div>
			<ItemsTable items={subcategory.items} />
		</div>
	);
}
