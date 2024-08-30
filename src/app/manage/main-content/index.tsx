'use client';

import { useState } from 'react';
import { UserCollections } from '../actions';
import { Sidebar } from './sidebar';
import { ItemsDisplay } from './items-display';

interface MainContentProps {
	collections: UserCollections;
}

export function MainContent({ collections }: MainContentProps) {
	const [selectedCategoryId, setSelectedCategoryId] = useState(collections[0]?.id);
	const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(
		collections[0]?.subcategories?.[0]?.id,
	);

	function handleSelectCategory(categoryId: string) {
		if (categoryId !== selectedCategoryId) {
			setSelectedCategoryId(categoryId);
			setSelectedSubcategoryId('');
			// setSelectedSubcategoryId(
			// 	collections.find((collection) => collection.id === categoryId)!.subcategories[0].id!,
			// );
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
