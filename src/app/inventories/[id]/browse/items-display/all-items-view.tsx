'use client';

import { Button } from '$/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '$/components/ui/dialog';
import { Package, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { ItemsDisplayProps } from '.';
import { ItemForm } from './item-form';
import { ItemsTable } from './items-table';

export function AllItemsView({
	inventory,
	selectedCategoryId,
	selectedSubcategoryId,
}: ItemsDisplayProps) {
	const category = inventory.categories.find(({ id }) => selectedCategoryId === id);
	const subcategory = category?.subcategories.find(({ id }) => selectedSubcategoryId === id);
	const [formKey, setFormKey] = useState(() => nanoid());

	function handleFormSuccess() {
		setFormKey(nanoid());
	}

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
					<Dialog key={formKey}>
						<DialogTrigger asChild>
							<Button size='sm' variant='outline'>
								<Plus />
								Add Item
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Create a new item</DialogTitle>
							</DialogHeader>
							<DialogDescription className='text-foreground'>
								Add a new item to the {subcategory.name} subcategory
							</DialogDescription>
							<ItemForm subcategoryId={subcategory.id} onSuccess={handleFormSuccess} />
						</DialogContent>
					</Dialog>
				</div>
			</div>
			<ItemsTable items={subcategory.items} inventory={inventory} />
		</div>
	);
}
