import { getInventoryById } from '$/data-access/inventories';
import { AppRoutes } from '$/lib/redirect';
import { PageParams } from '$/lib/types';
import { isLoggedIn } from '$/page-guards/is-logged-in';
import { redirect } from 'next/navigation';
import { InventoryContainer } from './container';

type Params = {
	id: string;
};

export default async function InventoryPage({ params }: PageParams<Params>) {
	if (!isLoggedIn()) {
		redirect(AppRoutes.AUTH.LOGIN);
	}

	const inventory = await getInventoryById(params.id);
	if (!inventory) {
		redirect(AppRoutes.PAGES.DASHBOARD);
	}

	return (
		<main>
			<InventoryContainer inventory={inventory} />
		</main>
	);
}
