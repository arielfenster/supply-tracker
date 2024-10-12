import {
	getInventoryById,
	getInventoryMembers,
	isUserInventoryMember,
} from '$/data-access/inventories';
import { getPendingInventoryInvitations } from '$/data-access/invites';
import { getUserIdFromCookie } from '$/lib/auth';
import { AppRoutes } from '$/lib/redirect';
import { PageParams } from '$/lib/types';
import { isLoggedIn } from '$/page-guards/is-logged-in';
import { redirect } from 'next/navigation';
import { ManageContainer } from './container';
import { ManagePageProvider } from './context';

type Params = {
	id: string;
};

export default async function ManagePage({ params }: PageParams<Params>) {
	if (!isLoggedIn()) {
		redirect(AppRoutes.AUTH.LOGIN);
	}

	const inventory = await getInventoryById(params.id);
	if (!inventory) {
		redirect(AppRoutes.PAGES.DASHBOARD);
	}

	const currentUserId = getUserIdFromCookie()!;
	if (!(await isUserInventoryMember(inventory.id, currentUserId))) {
		redirect(AppRoutes.PAGES.DASHBOARD);
	}

	const members = await getInventoryMembers(inventory.id);
	const currentMember = members.find((member) => member.user.id === currentUserId)!;

	const pendingInvitations = await getPendingInventoryInvitations(inventory.id);

	return (
		<main className='h-full m-4'>
			<h1 className='text-3xl font-bold'>Manage Inventory</h1>
			<div className='mt-8'>
				<ManagePageProvider
					inventoryId={inventory.id}
					members={members}
					currentMember={currentMember}
					pendingInvitations={pendingInvitations}
				>
					<ManageContainer />
				</ManagePageProvider>
			</div>
		</main>
	);
}
