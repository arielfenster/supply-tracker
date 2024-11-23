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
			{/* TODO: move this header to the layout? */}
			{/* maybe remove the layouts and render the Header component in the page, like here? */}
			<Header inventories={inventories} activeInventoryId={null} />
			<div className='mt-8 mx-8'>
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
