import { getInventoryById } from '$/data-access/inventories';
import { getUserIdFromCookie } from '$/lib/auth';
import { AppRoutes } from '$/lib/redirect';
import { PageParams } from '$/lib/types';
import { isLoggedIn } from '$/page-guards/is-logged-in';
import { getMembersForInventory, isUserAllowedToSeeInventory } from '$/services/inventory.service';
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
	if (!(await isUserAllowedToSeeInventory(inventory.id, currentUserId))) {
		redirect(AppRoutes.PAGES.DASHBOARD);
	}

	const members = await getMembersForInventory(inventory.id);
	const currentMember = members.find((member) => member.user.id === currentUserId)!;

	return (
		<main className='h-full m-4'>
			<h1 className='text-3xl font-bold'>Manage Inventory</h1>
			<div className='mt-8'>
				<ManagePageProvider inventory={inventory} members={members} currentMember={currentMember}>
					<ManageContainer />
				</ManagePageProvider>
			</div>
		</main>
	);
}
