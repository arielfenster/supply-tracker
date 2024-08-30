'use client';

import { Button } from '$/components/form/button';
import { Input } from '$/components/form/input';
import { Package, Plus } from 'lucide-react';
import { UserCollections } from '../actions';
import { ItemsTable } from './items-table';
import { nanoid } from 'nanoid';

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
	const category = collections.find(({ id }) => selectedCategoryId === id)!;
	const subcategory = category.subcategories.find(({ id }) => selectedSubcategoryId === id)!;

	const data = [
		{ id: nanoid(), name: 'Item A', quantity: 3, warningThreshold: 5, dangerThreshold: 2 },
		{ id: nanoid(), name: 'Item B', quantity: 1, warningThreshold: 4, dangerThreshold: 1 },
		{ id: nanoid(), name: 'Item C', quantity: 0, warningThreshold: 3, dangerThreshold: 0 },
		{ id: nanoid(), name: 'Item D', quantity: 12, warningThreshold: 3, dangerThreshold: 0 },
	];

	return (
		<div className='flex flex-col'>
			<div className='border-b border-neutral-300'>
				<div className='flex items-center gap-8 h-16 mx-8'>
					<Input
						placeholder='Search items...'
						className='text-md text-black placeholder:text-black'
					/>
					<div className='flex gap-2'>
						<Button
							size='sm'
							variant='outline'
							className='border-2 border-black hover:bg-neutral-100'
						>
							<Plus />
							Add Item
						</Button>
					</div>
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
				</div>
				{/* <ItemsTable items={subcategory.items} /> */}
				<ItemsTable items={data as any} />
			</div>
		</div>
	);
}
