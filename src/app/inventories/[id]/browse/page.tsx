import { getInventoryByIdHandler } from '$/data-access/handlers/inventories.handler';
import { AppRoutes } from '$/lib/redirect';
import { PageParams } from '$/lib/types';
import { redirect } from 'next/navigation';
import { InventoryContainer } from './container';

type Params = {
	id: string;
};

export default async function InventoryPage({ params }: PageParams<Params>) {
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
