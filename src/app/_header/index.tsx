import { Inventory } from '$/db/schemas';
import { Navbar } from './navbar';

export function Header({
	inventories,
	activeInventoryId,
}: {
	inventories: Inventory[];
	activeInventoryId: string | null;
}) {
	return (
		<header className='flex justify-between items-center h-16 border-b border-neutral-300 bg-foreground'>
			<h2 className='text-2xl font-semibold pl-6 pt-4 w-[240px] h-full border-neutral-300 text-background'>
				Supply Tracker
			</h2>
			<Navbar inventories={inventories} activeInventoryId={activeInventoryId} />
		</header>
	);
}
