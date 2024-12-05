import { getInventoryByIdHandler } from '$/data-access/handlers/inventories.handler';
import { AppRoutes } from '$/lib/routes';
import { PageParams } from '$/lib/types';
import { isLoggedIn } from '$/page-guards/is-logged-in';
import { redirect } from 'next/navigation';
import { InventoryContainer } from './container';

type Params = {
	id: string;
};

export default async function InventoryPage({ params }: PageParams<Params>) {
	if (!(await isLoggedIn())) {
		redirect(AppRoutes.AUTH.LOGIN);
	}

	const inventory = await getInventoryByIdHandler(params.id);
	if (!inventory) {
		redirect(AppRoutes.PAGES.DASHBOARD);
	}

	return (
		<main>
			<InventoryContainer inventory={inventory} />
		</main>
	);
}
