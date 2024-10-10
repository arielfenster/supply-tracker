import { getInventoryById } from '$/data-access/inventories';
import { AppRoutes } from '$/lib/redirect';
import { PageParams } from '$/lib/types';
import { isLoggedIn } from '$/page-guards/is-logged-in';
import { redirect } from 'next/navigation';
import { ManageContainer } from './container';

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

	// const members = await getInventoryMembers(inventory.id);
	// console.log(JSON.stringify(members, null, 2));

	return (
		<main className='h-full m-4'>
			<h1 className='text-3xl font-bold'>Manage Inventory</h1>
			<div className='mt-8'>
				<ManageContainer />
			</div>
		</main>
	);
}
