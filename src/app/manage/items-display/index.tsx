'use client';

import { Input } from '$/components/form/input';
import { Package } from 'lucide-react';
import { UserInventory } from '../actions';
import { AddItemFormContainer } from './add-item-form';
import { ItemsTable } from './items-table';

interface ItemsDisplayProps {
	inventory: UserInventory;
	selectedCategoryId: string;
	selectedSubcategoryId: string;
}

export function ItemsDisplay({
	inventory,
	selectedCategoryId,
	selectedSubcategoryId,
}: ItemsDisplayProps) {
	const category = inventory.categories.find(({ id }) => selectedCategoryId === id)!;
	const subcategory = category.subcategories.find(({ id }) => selectedSubcategoryId === id)!;

	return (
		<div className='flex flex-col'>
			<div className='border-b border-neutral-300'>
				<div className='flex items-center gap-8 h-16 mx-8'>
					<Input
						placeholder='Search items...'
						className='text-md text-black placeholder:text-black'
					/>
				</div>
			</div>
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
		</div>
	);
}
