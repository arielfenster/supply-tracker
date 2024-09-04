'use client';

import { useEffect, useState } from 'react';
import { QueryParams, useQueryParams } from '../_hooks/useQueryParams';
import { UserInventory } from './actions';
import { ItemsDisplay } from './items-display';
import { Sidebar } from './sidebar';

interface ManageContainerProps {
	inventory: UserInventory;
}

export function ManageContainer({ inventory }: ManageContainerProps) {
	const { updateQueryParams } = useQueryParams();

	const [selectedCategoryId, setSelectedCategoryId] = useState(inventory.categories[0]?.id);
	const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(
		inventory.categories[0]?.subcategories?.[0]?.id,
	);

	useEffect(() => {
		if (!selectedCategoryId) {
			return;
		}

		const selectedCategory = inventory.categories.find(({ id }) => id === selectedCategoryId)!;
		const { name: selectedCategoryName } = selectedCategory;

		const selectedSubcategoryName = selectedSubcategoryId
			? selectedCategory.subcategories.find(({ id }) => id === selectedSubcategoryId)!.name
			: '';

		updateQueryParams({
			[QueryParams.CATEGORY]: selectedCategoryName,
			[QueryParams.SUBCATEGORY]: selectedSubcategoryName,
		});
	}, [updateQueryParams, selectedCategoryId, selectedSubcategoryId, inventory.categories]);

	function handleSelectCategory(categoryId: string) {
		if (categoryId !== selectedCategoryId) {
			setSelectedCategoryId(categoryId);
			setSelectedSubcategoryId(
				inventory.categories.find((category) => category.id === categoryId)!.subcategories[0]?.id,
			);
		}
	}

	return (
		<div className='grid grid-cols-[240px_1fr]'>
			<Sidebar
				inventory={inventory}
				selectedCategoryId={selectedCategoryId}
				selectedSubcategoryId={selectedSubcategoryId}
				onSelectCategory={handleSelectCategory}
				onSelectSubcategory={setSelectedSubcategoryId}
			/>
			{selectedCategoryId && selectedSubcategoryId && (
				<ItemsDisplay
					inventory={inventory}
					selectedCategoryId={selectedCategoryId}
					selectedSubcategoryId={selectedSubcategoryId}
				/>
			)}
		</div>
	);
}
