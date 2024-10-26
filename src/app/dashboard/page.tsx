import { Header } from '$/components/header';
import { getCurrentUser } from '$/lib/auth';
import { AppRoutes } from '$/lib/redirect';
import { getInventoriesUserIsEligibleToView } from '$/services/inventories.service';
import { redirect } from 'next/navigation';
import { InventoriesView } from './inventories-view';
import { NoInventoriesView } from './no-inventories-view';

export default async function DashboardPage() {
	const user = await getCurrentUser();
	if (!user) {
		redirect(AppRoutes.AUTH.LOGIN);
	}

	const inventories = await getInventoriesUserIsEligibleToView(user.id);

	return (
		<main className='w-full h-full'>
			<Header inventories={inventories} activeInventoryId={null} />
			<div className='mt-8 ml-8'>
				<h1 className='text-3xl'>Dashboard</h1>
				{inventories.length ? (
					<InventoriesView inventories={inventories} currentUserId={user.id} />
				) : (
					<NoInventoriesView />
				)}
			</div>
		</main>
	);
}
