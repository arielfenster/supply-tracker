'use client';

import { InventoryNavigator } from '$/components/inventory-navigator';
import { UserInventory } from '$/data-access/handlers/inventories.handler';
import { LocalStorageKeys, useLocalStorage } from '$/hooks/useLocalStorage';
import { useMediaQuery } from '$/hooks/useMediaQuery';
import { QueryParams, useQueryParams } from '$/hooks/useQueryParams';
import { cn } from '$/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { ItemsDisplay } from './items-display';

interface InventoryContainerProps {
	inventory: UserInventory;
}

export function InventoryContainer({ inventory }: InventoryContainerProps) {
	const { isDesktop } = useMediaQuery()
	const { setKey } = useLocalStorage();
	setKey(LocalStorageKeys.ACTIVE_INVENTORY_ID, inventory.id);

	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
	const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
	const initialRenderRef = useRef(true);

	const { updateQueryParams, getQueryParam } = useQueryParams();

	useEffect(() => {
		if (initialRenderRef.current) {
			initialRenderRef.current = false;

			const categoryName = getQueryParam(QueryParams.CATEGORY);
			const category = inventory.categories.find(({ name }) => name === categoryName);
			setSelectedCategoryId(category?.id || '');

			const subcategoryName = getQueryParam(QueryParams.SUBCATEGORY);
			const subcategory = category?.subcategories.find(({ name }) => name === subcategoryName);
			setSelectedSubcategoryId(subcategory?.id || '');

			return;
		}

		const category = inventory.categories.find(({ id }) => id === selectedCategoryId);
		if (!category) {
			return;
		}
		const { name: categoryName } = category;

		const subcategoryName = category.subcategories.find(
			({ id }) => id === selectedSubcategoryId,
		)?.name;

		updateQueryParams({
			[QueryParams.CATEGORY]: categoryName,
			[QueryParams.SUBCATEGORY]: subcategoryName,
		});
	}, [
		selectedCategoryId,
		selectedSubcategoryId,
		inventory.categories,
		getQueryParam,
		updateQueryParams,
	]);

	function handleSelectCategory(categoryId: string) {
		if (categoryId !== selectedCategoryId) {
			setSelectedCategoryId(categoryId);
			setSelectedSubcategoryId(
				inventory.categories.find((category) => category.id === categoryId)!.subcategories[0]?.id,
			);
		}
	}

	return (
		<div className={cn(isDesktop ? 'grid grid-cols-[272px_1fr]' : '')}>
			{selectedCategoryId !== null && selectedSubcategoryId !== null && (
				<InventoryNavigator
					inventory={inventory}
					selectedCategoryId={selectedCategoryId}
					selectedSubcategoryId={selectedSubcategoryId}
					onSelectCategory={handleSelectCategory}
					onSelectSubcategory={setSelectedSubcategoryId}
				/>
			)}
			{selectedCategoryId && selectedSubcategoryId && (
				<div className={cn(isDesktop && 'top-16 w-3/4')}> 
					<ItemsDisplay
						inventory={inventory}
						selectedCategoryId={selectedCategoryId}
						selectedSubcategoryId={selectedSubcategoryId}
					/>
				</div>
			)}
		</div>
	);
}
