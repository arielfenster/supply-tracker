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
import { executeServerAction } from '$/lib/forms';
import { AppRoutes, replaceUrlPlaceholder } from '$/lib/redirect';
import { cn } from '$/lib/utils';
import { useFormStore } from '$/stores/form.store';
import { BookOpen, PlusCircle, Settings, UserCircle, WarehouseIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LocalStorageKeys, useLocalStorage } from '../_hooks/useLocalStorage';
import { CreateInventoryForm } from '../dashboard/create-inventory-form';
import { logoutUserAction } from './actions';

export function Navbar({
	inventories,
	activeInventoryId,
}: {
	inventories: UserInventory[];
	activeInventoryId: string | null;
}) {
	const { getKey } = useLocalStorage();
	activeInventoryId = activeInventoryId ?? getKey(LocalStorageKeys.ACTIVE_INVENTORY_ID);

	return (
		<nav className='mr-6'>
			<ul className='flex gap-6 items-center'>
				<SelectInventoryDialog inventories={inventories} activeInventoryId={activeInventoryId} />
				{activeInventoryId && (
					<>
						<li>
							<Link
								className='flex items-center gap-1 text-background hover:underline'
								href={replaceUrlPlaceholder(AppRoutes.PAGES.INVENTORIES.BROWSE, [
									activeInventoryId,
								])}
							>
								<BookOpen />
								Browse Inventory
							</Link>
						</li>
						<li>
							<Link
								className='flex items-center gap-1 text-background hover:underline'
								href={replaceUrlPlaceholder(AppRoutes.PAGES.INVENTORIES.MANAGE, [
									activeInventoryId,
								])}
							>
								<Settings />
								Manage
							</Link>
						</li>
					</>
				)}
				<li className='hover:opacity-75'>
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
	activeInventoryId: string | null;
}) {
	const [showNewInventoryForm, setShowNewInventoryForm] = useState(false);

	const activeInventoryName = inventories.find(
		(inventory) => inventory.id === activeInventoryId,
	)?.name;
	const triggerTitle = activeInventoryName || 'Your Inventories';

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='secondary' size='sm' className='flex gap-2'>
					<WarehouseIcon />
					{triggerTitle}
				</Button>
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

function UserProfileDropdown() {
	const { setKey } = useLocalStorage();
	const setPending = useFormStore((store) => store.setPending);
	const router = useRouter();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<UserCircle className='h-8 w-8 cursor-pointer text-background' />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem>
					<Link href={AppRoutes.PAGES.USER}>Profile</Link>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<form
						action={executeServerAction(logoutUserAction, setPending, {
							success() {
								setKey(LocalStorageKeys.ACTIVE_INVENTORY_ID);
								router.push(AppRoutes.AUTH.LOGIN);
							},
						})}
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
