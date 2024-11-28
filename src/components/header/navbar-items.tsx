'use client';

import { Button } from '$/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '$/components/ui/dialog';
import { Inventory } from '$/db/schemas';
import { useMediaQuery } from '$/hooks/useMediaQuery';
import { executeServerAction } from '$/lib/forms';
import { isManageInventoryRole } from '$/lib/inventories';
import { AppRoutes, replaceUrlPlaceholder } from '$/lib/redirect';
import { cn } from '$/lib/utils';
import { InventoryWithOwner } from '$/services/inventories.service';
import { useFormStore } from '$/stores/form.store';
import { useInventoryStore } from '$/stores/inventory.store';
import {
	BookOpen,
	GaugeIcon,
	PlusCircle,
	PowerIcon,
	Settings,
	UserCircle,
	WarehouseIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CreateInventoryForm } from '../../app/dashboard/create-inventory-form';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { logoutUserAction } from './actions';

export function NavbarItems({
	inventories,
	activeInventoryId,
}: {
	inventories: InventoryWithOwner[];
	activeInventoryId: string | null;
}) {
	const { isMobile } = useMediaQuery();

	const currentUserRole = inventories.find((inventory) => inventory.id === activeInventoryId)?.role;
	const canUserManageInventory = isManageInventoryRole(currentUserRole);

	return (
		<>
			<li>
				<SelectInventoryDialog inventories={inventories} activeInventoryId={activeInventoryId} />
			</li>
			{activeInventoryId && (
				<>
					<li>
						<Link
							className='flex items-center gap-2 hover:underline'
							href={replaceUrlPlaceholder(AppRoutes.PAGES.INVENTORIES.BROWSE, [activeInventoryId])}
						>
							<BookOpen />
							Browse
						</Link>
					</li>
					{canUserManageInventory && (
						<li>
							<Link
								className='flex items-center gap-2 hover:underline'
								href={replaceUrlPlaceholder(AppRoutes.PAGES.INVENTORIES.MANAGE, [
									activeInventoryId,
								])}
							>
								<Settings />
								Manage
							</Link>
						</li>
					)}
				</>
			)}
			<li>
				<Link
					className='flex items-center gap-2 hover:underline'
					href={AppRoutes.PAGES.DASHBOARD}
				>
					<GaugeIcon />
					Dashboard
				</Link>
			</li>
			{isMobile ? (
				<>
					<li className='hover:opacity-75'>
						<Link className='flex items-center gap-2 hover:underline' href={AppRoutes.PAGES.USER}>
							<UserCircle className='h-6 w-6 cursor-pointer' />
							Profile
						</Link>
					</li>
					<li>
						<LogoutForm />
					</li>
				</>
			) : (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<UserCircle className='h-8 w-8 cursor-pointer text-background' />
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>
							<Link
								className='w-full text-center h-8 flex justify-center items-center'
								href={AppRoutes.PAGES.USER}
							>
								Profile
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<LogoutForm />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)}
		</>
	);
}

function SelectInventoryDialog({
	inventories,
	activeInventoryId,
}: {
	inventories: Inventory[];
	activeInventoryId: string | null;
}) {
	const [showNewInventoryForm, setShowNewInventoryForm] = useState(false);

	const activeInventoryName = inventories.find(
		(inventory) => inventory.id === activeInventoryId,
	)?.name;

	return (
		<Dialog>
			<DialogTrigger asChild>
				<button className='flex items-center gap-2 md:p-2 md:text-background hover:underline'>
					<WarehouseIcon />
					{activeInventoryName ? `Inventory: ${activeInventoryName}` : 'Choose Inventory'}
				</button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Manage Inventories</DialogTitle>
				</DialogHeader>
				<DialogDescription className='text-foreground'>
					View your inventories or create a new one
				</DialogDescription>
				{showNewInventoryForm ? (
					<CreateInventoryForm
						onSuccess={() => setShowNewInventoryForm(false)}
						onCancel={() => setShowNewInventoryForm(false)}
					/>
				) : (
					<div className='flex flex-col gap-2'>
						{inventories.map((inventory) => (
							<Link
								key={inventory.id}
								href={replaceUrlPlaceholder(AppRoutes.PAGES.INVENTORIES.BROWSE, [inventory.id])}
								className={cn(
									'cursor-pointer hover:bg-gray-200 p-3 rounded-md',
									inventory.id === activeInventoryId && 'bg-gray-200',
								)}
							>
								{inventory.name}
							</Link>
						))}
						<div className='mt-4'>
							<Button className='flex gap-2 w-full' onClick={() => setShowNewInventoryForm(true)}>
								<PlusCircle className='h-4 w-4' />
								<span>Add New Inventory</span>
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}

function LogoutForm() {
	const { setActiveInventoryId } = useInventoryStore();
	const setPending = useFormStore((store) => store.setPending);
	const router = useRouter();
	const { isMobile } = useMediaQuery();

	return (
		<form
			className='w-full'
			action={executeServerAction(logoutUserAction, setPending, {
				success() {
					setActiveInventoryId(null);
					router.push(AppRoutes.AUTH.LOGIN);
				},
			})}
		>
			{isMobile ? (
				<button className='flex items-center gap-2 hover:underline'>
					<PowerIcon className='h-6 w-6' />
					Logout
				</button>
			) : (
				<Button className='font-normal hover:no-underline w-full gap-2' variant='link'>
					Logout
				</Button>
			)}
		</form>
	);
}
