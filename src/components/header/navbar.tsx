'use client';

import { SearchBar } from '$/app/inventories/[id]/browse/items-display/search-bar';
import { AppRoutes, doesPathnameMatchRoute } from '$/lib/routes';
import { InventoryWithOwner } from '$/services/inventories.service';
import { MenuIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '../ui/sheet';
import { NavbarItems } from './navbar-items';

export function Navbar({
	inventories,
	activeInventoryId,
}: {
	inventories: InventoryWithOwner[];
	activeInventoryId: string | null;
}) {
	const pathname = usePathname();
	const isInBrowseInventoryPage = doesPathnameMatchRoute(pathname, AppRoutes.PAGES.INVENTORIES.BROWSE);

	return (
		<nav className='mx-6 flex-1 md:flex-none'>
			{/* desktop navbar */}
			<div className='hidden md:flex'>
				<ul className='flex gap-6 items-center text-background'>
					<NavbarItems inventories={inventories} activeInventoryId={activeInventoryId} />
				</ul>
			</div>

			{/* mobile navbar */}
			<div className='flex gap-4 md:hidden'>
				{isInBrowseInventoryPage && (
					<div className='w-full'>
						<SearchBar />
					</div>
				)}
				<Sheet>
					<SheetTrigger asChild className=''>
						<button className='text-gray-300'>
							<MenuIcon size={24} />
						</button>
					</SheetTrigger>
					<SheetContent className='w-[250px] p-0'>
						<SheetHeader>
							<SheetTitle />
							<SheetDescription />
						</SheetHeader>
						<ul className='flex flex-col gap-3 items-left p-4 text-foreground'>
							<NavbarItems inventories={inventories} activeInventoryId={activeInventoryId} />
						</ul>
					</SheetContent>
				</Sheet>
			</div>
		</nav>
	);
}
