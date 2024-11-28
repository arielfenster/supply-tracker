'use client';

import { useMediaQuery } from '$/hooks/useMediaQuery';
import { InventoryWithOwner } from '$/services/inventories.service';
import { useInventoryStore } from '$/stores/inventory.store';
import { InventoryNavigator } from '../inventory-navigator';
import { Navbar } from './navbar';

export function Header({
	inventories,
	activeInventoryId,
}: {
	inventories: InventoryWithOwner[];
	activeInventoryId: string | null;
}) {
	const { isDesktop } = useMediaQuery();
	const {
		inventory,
		selectedCategoryId,
		selectedSubcategoryId,
		setSelectedCategoryId,
		setSelectedSubcategoryId,
	} = useInventoryStore();

	return (
		<header className='flex justify-between items-center h-16 border-b border-neutral-300 bg-foreground'>
			<div className='flex items-center'>
				<h2 className='text-2xl font-semibold pl-6 w-[240px] h-full border-neutral-300 text-background'>
					Supply Tracker
				</h2>
				{inventory && !isDesktop && (
					<InventoryNavigator
						inventory={inventory}
						selectedCategoryId={selectedCategoryId}
						selectedSubcategoryId={selectedSubcategoryId}
						onSelectCategory={setSelectedCategoryId}
						onSelectSubcategory={setSelectedSubcategoryId}
					/>
				)}
			</div>
			<Navbar inventories={inventories} activeInventoryId={activeInventoryId} />
		</header>
	);
}
