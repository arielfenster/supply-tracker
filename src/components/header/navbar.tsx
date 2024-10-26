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
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '$/components/ui/dropdown-menu';
import { Inventory } from '$/db/schemas';
import { executeServerAction } from '$/lib/forms';
import { AppRoutes, replaceUrlPlaceholder } from '$/lib/redirect';
import { cn } from '$/lib/utils';
import { useFormStore } from '$/stores/form.store';
import { BookOpen, GaugeIcon, PlusCircle, Settings, UserCircle, WarehouseIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LocalStorageKeys, useLocalStorage } from '../../hooks/useLocalStorage';
import { CreateInventoryForm } from '../../app/dashboard/create-inventory-form';
import { logoutUserAction } from './actions';

export function Navbar({
	inventories,
	activeInventoryId,
}: {
	inventories: Inventory[];
	activeInventoryId: string | null;
}) {
	const { getKey, setKey } = useLocalStorage();
	activeInventoryId = activeInventoryId ?? getKey(LocalStorageKeys.ACTIVE_INVENTORY_ID);
	const pathname = usePathname();

	return (
		<nav className='mr-6'>
			<ul className='flex gap-6 items-center'>
				{pathname !== AppRoutes.PAGES.DASHBOARD && (
					<>
						<li>
							<Link
								className='flex items-center gap-1 text-background hover:underline'
								href={AppRoutes.PAGES.DASHBOARD}
								onClick={() => {
									setKey(LocalStorageKeys.ACTIVE_INVENTORY_ID);
								}}
							>
								<GaugeIcon />
								Dashboard
							</Link>
						</li>
						<SelectInventoryDialog
							inventories={inventories}
							activeInventoryId={activeInventoryId}
						/>
					</>
				)}
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
								Browse
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
	inventories: Inventory[];
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
					<Link
						className='w-full text-center h-8 flex justify-center items-center'
						href={AppRoutes.PAGES.USER}
					>
						Profile
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<form
						className='w-full'
						action={executeServerAction(logoutUserAction, setPending, {
							success() {
								setKey(LocalStorageKeys.ACTIVE_INVENTORY_ID);
								router.push(AppRoutes.AUTH.LOGIN);
							},
						})}
					>
						<SubmitButton className='font-normal hover:no-underline w-full' variant='link'>
							Logout
						</SubmitButton>
					</form>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
