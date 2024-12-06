import { InventoryWithOwner } from '$/services/inventories.service';
import { Navbar } from './navbar';

export function Header({
	inventories,
	activeInventoryId,
}: {
	inventories: InventoryWithOwner[];
	activeInventoryId: string | null;
}) {
	return (
		<header className='flex justify-between items-center h-16 border-b border-neutral-300 bg-foreground'>
			<h2 className='hidden sm:block text-xl md:text-2xl font-semibold pl-6 pt-4 w-[240px] h-full border-neutral-300 text-background'>
				Supply Tracker
			</h2>
			<div className="block sm:hidden ml-4 w-14 h-14 bg-blue-500 rounded-full text-white text-xl font-bold flex items-center justify-center">
				ST
			</div>
			<Navbar inventories={inventories} activeInventoryId={activeInventoryId} />
		</header>
	);
}
