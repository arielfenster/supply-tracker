'use client';

import { AllItemsView, AllItemsViewProps } from './all-items-view';
import { FilterItemsView } from './filter-items-view';
import { SearchBar } from './search-bar';

interface ItemsDisplayProps extends AllItemsViewProps {
	itemsFilterString?: string;
}

export function ItemsDisplay({
	inventory,
	selectedCategoryId,
	selectedSubcategoryId,
	itemsFilterString,
}: ItemsDisplayProps) {
	return (
		<div className='flex flex-col'>
			<div className='border-b border-neutral-300'>
				<div className='flex items-center gap-8 h-16 mx-8'>
					<SearchBar />
				</div>
			</div>
			{itemsFilterString ? (
				<FilterItemsView inventory={inventory} filter={itemsFilterString} />
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
