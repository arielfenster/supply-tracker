import { getCurrentUser, getUserId } from '$/lib/auth';
import { AppRoutes } from '$/lib/redirect';
import { redirect } from 'next/navigation';
import { getUserInventoriesAction } from './actions';
import { InventoriesView } from './inventories-view';
import { NoInventoriesView } from './no-inventories-view';

export default async function DashboardPage() {
	const user = await getCurrentUser();
	if (!user) {
		redirect(AppRoutes.AUTH.LOGIN);
	}

	const inventories = await getUserInventoriesAction(user.id);

	return (
		<main className='w-full h-full'>
			<h1 className='text-2xl'>Dashboard</h1>
			{inventories.length ? <InventoriesView inventories={inventories} /> : <NoInventoriesView />}
		</main>
	);
}
