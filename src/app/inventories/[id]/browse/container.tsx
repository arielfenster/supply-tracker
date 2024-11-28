'use client';

import { InventoryNavigator } from '$/components/inventory-navigator';
import { UserInventory } from '$/data-access/handlers/inventories.handler';
import { useMediaQuery } from '$/hooks/useMediaQuery';
import { QueryParams, useQueryParams } from '$/hooks/useQueryParams';
import { getCategoryFromId, getSubcategoryFromId } from '$/lib/inventories';
import { cn } from '$/lib/utils';
import { useInventoryStore } from '$/stores/inventory.store';
import { useEffect } from 'react';
import { ItemsDisplay } from './items-display';

interface InventoryContainerProps {
	inventory: UserInventory;
}

export function InventoryContainer({ inventory }: InventoryContainerProps) {
	const { isDesktop } = useMediaQuery()
	const { updateQueryParams, getQueryParam } = useQueryParams();
	const {
		setInventory,
		selectedCategoryId,
		selectedSubcategoryId,
		setSelectedCategoryId,
		setSelectedSubcategoryId,
	} = useInventoryStore();

	useEffect(() => {
		setInventory(inventory, getQueryParam(QueryParams.CATEGORY), getQueryParam(QueryParams.SUBCATEGORY));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const category = getCategoryFromId(inventory, selectedCategoryId!);
		if (!category) {
			return;
		}
		const subcategory = getSubcategoryFromId(category, selectedSubcategoryId!);

		updateQueryParams({
			[QueryParams.CATEGORY]: category.name,
			[QueryParams.SUBCATEGORY]: subcategory.name,
		});
	}, [inventory, selectedCategoryId, selectedSubcategoryId, updateQueryParams]);

	return (
		<div className={cn(isDesktop && 'grid grid-cols-[272px_1fr]')}>
			{selectedCategoryId !== null && selectedSubcategoryId !== null && (
				<InventoryNavigator
					inventory={inventory}
					selectedCategoryId={selectedCategoryId}
					selectedSubcategoryId={selectedSubcategoryId}
					onSelectCategory={setSelectedCategoryId}
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
