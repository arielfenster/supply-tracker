import { getUserInventories } from '$/data-access/inventories';
import { getCurrentUser } from '$/lib/auth';
import { AppRoutes } from '$/lib/redirect';
import { redirect } from 'next/navigation';
import { InventoriesView } from './inventories-view';
import { NoInventoriesView } from './no-inventories-view';

export default async function DashboardPage() {
	const user = await getCurrentUser();
	if (!user) {
		redirect(AppRoutes.AUTH.LOGIN);
	}

	const inventories = await getUserInventories(user.id);

	return (
		<main className='w-full h-full mt-8 ml-8'>
			<h1 className='text-3xl'>Dashboard</h1>
			{inventories.length ? (
				<InventoriesView inventories={inventories} currentUserId={user.id} />
			) : (
				<NoInventoriesView />
			)}
		</main>
	);
}
