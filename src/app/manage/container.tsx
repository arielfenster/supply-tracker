'use client';

import { useState } from 'react';
import { UserCollections } from './actions';
import { ItemsDisplay } from './items-display';
import { Sidebar } from './sidebar';

interface ManageContainerProps {
	collections: UserCollections;
}

export function ManageContainer({ collections }: ManageContainerProps) {
	const [selectedCategoryId, setSelectedCategoryId] = useState(collections[0]?.id);
	const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(
		collections[0]?.subcategories?.[0]?.id,
	);

	function handleSelectCategory(categoryId: string) {
		if (categoryId !== selectedCategoryId) {
			setSelectedCategoryId(categoryId);
			setSelectedSubcategoryId(
				collections.find((collection) => collection.id === categoryId)!.subcategories[0].id!,
			);
		}
	}

	return (
		<div className='grid grid-cols-[240px_1fr]'>
			<Sidebar
				collections={collections}
				selectedCategoryId={selectedCategoryId}
				selectedSubcategoryId={selectedSubcategoryId}
				onSelectCategory={handleSelectCategory}
				onSelectSubcategory={setSelectedSubcategoryId}
			/>
			<ItemsDisplay
				collections={collections}
				selectedCategoryId={selectedCategoryId}
				selectedSubcategoryId={selectedSubcategoryId}
			/>
		</div>
	);
}
