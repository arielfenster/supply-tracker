'use client';

import { SubmitButton } from '$/components/form/submit-button';
import { Button } from '$/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '$/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '$/components/ui/dropdown-menu';
import { UserInventory } from '$/data-access/inventories';
import { AppRoutes, replaceUrlPlaceholder } from '$/lib/redirect';
import { cn } from '$/lib/utils';
import { UserCircle, WarehouseIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logoutUserAction } from './actions';

export function Navbar({
	inventories,
	activeInventoryId,
}: {
	inventories: UserInventory[];
	activeInventoryId: string;
}) {
	return (
		<nav>
			<ul className='flex gap-4 items-center'>
				<SelectInventoryDialog inventories={inventories} activeInventoryId={activeInventoryId} />
				<li className='text-lg hover:underline text-background'>
					<Link href={AppRoutes.PAGES.INVENTORY}>Browse Inventory</Link>
				</li>
				<li className='text-lg hover:underline text-background'>
					<Link href={AppRoutes.PAGES.MANAGE}>Manage</Link>
				</li>
				<li className='text-lg underline hover:opacity-50 absolute right-6'>
					<UserProfileDropdown />
				</li>
			</ul>
		</nav>
	);
}

function SelectInventoryDialog({
	inventories,
	activeInventoryId,
}: {
	inventories: UserInventory[];
	activeInventoryId: string;
}) {
	const activeInventoryName = inventories.find(
		(inventory) => inventory.id === activeInventoryId,
	)!.name;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='secondary' className='flex gap-2 items-center'>
					<WarehouseIcon />
					{activeInventoryName}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Select Inventory</DialogTitle>
				</DialogHeader>
				<DialogDescription />
				<div className='flex flex-col gap-2'>
					{inventories.map((inventory) => (
						<Link
							key={inventory.id}
							href={replaceUrlPlaceholder(AppRoutes.PAGES.INVENTORIES.BROWSE, [inventory.id])}
							className={cn(
								'cursor-pointer hover:bg-gray-100 p-3 rounded-md',
								inventory.id === activeInventoryId && 'bg-gray-100',
							)}
						>
							{inventory.name}
						</Link>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}

function UserProfileDropdown() {
	const router = useRouter();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<UserCircle className='h-8 w-8 cursor-pointer' />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem>
					<Link href={AppRoutes.PAGES.USER}>Profile</Link>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<form
						action={async () => {
							await logoutUserAction();
							router.push(AppRoutes.AUTH.LOGIN);
						}}
					>
						<SubmitButton className='p-0 font-normal hover:no-underline' variant='link'>
							Logout
						</SubmitButton>
					</form>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
