import { AuthContextProvider } from '$/app/(auth)/context';
import { getInventoryByIdHandler } from '$/data-access/handlers/inventories.handler';
import { getCurrentUser } from '$/lib/auth';
import { AppRoutes } from '$/lib/routes';
import { PageParams } from '$/lib/types';
import { redirect } from 'next/navigation';
import { InventoryContainer } from './container';

type Params = {
	id: string;
};

export default async function InventoryPage({ params }: PageParams<Params>) {
	const user = await getCurrentUser();
	if (!user) {
		redirect(AppRoutes.AUTH.LOGIN);
	}

	const inventory = await getInventoryByIdHandler(params.id);
	if (!inventory) {
		redirect(AppRoutes.PAGES.DASHBOARD);
	}

	return (
		<main>
			<AuthContextProvider user={user}>
				<InventoryContainer inventory={inventory} />
			</AuthContextProvider>
		</main>
	);
}
