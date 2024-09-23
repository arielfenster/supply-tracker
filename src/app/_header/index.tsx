import { UserInventory } from '$/data-access/inventories';
import { Navbar } from './navbar';

export function Header({
	inventories,
	activeInventoryId,
}: {
	inventories: UserInventory[];
	activeInventoryId: string;
}) {
	return (
		<header className='flex items-baseline h-16 border-b border-neutral-300 bg-foreground'>
			<h2 className='text-2xl font-semibold pl-6 pt-4 w-[240px] h-full border-neutral-300 text-background'>
				Supply Tracker
			</h2>
			<Navbar inventories={inventories} activeInventoryId={activeInventoryId} />
		</header>
	);
}
