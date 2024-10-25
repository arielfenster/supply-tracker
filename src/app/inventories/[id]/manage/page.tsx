import { getInventoryByIdHandler } from '$/data-access/handlers/inventories.handler';
import { getUserIdFromCookie } from '$/lib/auth';
import { AppRoutes } from '$/lib/redirect';
import { PageParams } from '$/lib/types';
import { isLoggedIn } from '$/page-guards/is-logged-in';
import {
	getMembersForInventory,
	isUserEligibleToViewInventory,
} from '$/services/inventories.service';
import { redirect } from 'next/navigation';
import { ManageContainer } from './container';
import { ManagePageProvider } from './context';
import { getPendingInventoryInvites } from '$/services/invites.service';

type Params = {
	id: string;
};

export default async function ManagePage({ params }: PageParams<Params>) {
	if (!isLoggedIn()) {
		redirect(AppRoutes.AUTH.LOGIN);
	}

	const inventory = await getInventoryByIdHandler(params.id);
	if (!inventory) {
		redirect(AppRoutes.PAGES.DASHBOARD);
	}

	const currentUserId = getUserIdFromCookie()!;
	if (!(await isUserEligibleToViewInventory(inventory.id, currentUserId))) {
		redirect(AppRoutes.PAGES.DASHBOARD);
	}

	const [members, pendingInvites] = await Promise.all([
		getMembersForInventory(inventory.id),
		getPendingInventoryInvites(inventory.id),
	]);
	const currentMember = members.find((member) => member.user.id === currentUserId)!;

	return (
		<main className='h-full m-4'>
			<h1 className='text-3xl font-bold'>Manage Inventory</h1>
			<div className='mt-8'>
				<ManagePageProvider
					inventory={inventory}
					members={members}
					currentMember={currentMember}
					pendingInvites={pendingInvites}
				>
					<ManageContainer />
				</ManagePageProvider>
			</div>
		</main>
	);
}
