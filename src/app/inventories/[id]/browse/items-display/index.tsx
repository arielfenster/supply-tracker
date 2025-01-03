'use client';

import { UserInventory } from '$/data-access/handlers/inventories.handler';
import { useMediaQuery } from '$/hooks/useMediaQuery';
import { QueryParams, useQueryParams } from '$/hooks/useQueryParams';
import { AllItemsView } from './all-items-view';
import { FilterItemsView } from './filter-items-view';
import { SearchBar } from './search-bar';

export interface ItemsDisplayProps {
	inventory: UserInventory;
	selectedCategoryId: string;
	selectedSubcategoryId: string;
}

export function ItemsDisplay({
	inventory,
	selectedCategoryId,
	selectedSubcategoryId,
}: ItemsDisplayProps) {
	const { isMobile } = useMediaQuery();
	const { getQueryParam } = useQueryParams();
	const itemsFilterString = getQueryParam(QueryParams.SEARCH);
	const isGlobalFilter = getQueryParam(QueryParams.GLOBAL) === '1';

	return (
		<div className='flex flex-col overflow-y-auto mb-20'>
			{!isMobile && (
				<div className='border-b border-neutral-300'>
					<div className='flex items-center gap-8 h-16 mx-8'>
						<SearchBar />
					</div>
				</div>
			)}
			{itemsFilterString ? (
				<FilterItemsView
					inventory={inventory}
					filter={itemsFilterString}
					isGlobalFilter={isGlobalFilter}
					selectedCategoryId={selectedCategoryId}
					selectedSubcategoryId={selectedSubcategoryId}
				/>
			) : (
				<AllItemsView
					inventory={inventory}
					selectedCategoryId={selectedCategoryId}
					selectedSubcategoryId={selectedSubcategoryId}
				/>
			)}
		</div>
	);
}
