import { getUserId } from '$/lib/auth';
import { AppRoutes, appRedirect } from '$/lib/redirect';
import { isLoggedIn } from '$/page-guards/is-logged-in';
import { getUserInventoryAction } from './actions';
import { InventoryContainer } from './container';

export default async function InventoryPage() {
	if (!isLoggedIn()) {
		appRedirect(AppRoutes.AUTH.LOGIN);
	}

	const userId = getUserId();
	const inventory = await getUserInventoryAction(userId!);

	return (
		<main>
			<InventoryContainer inventory={inventory} />
		</main>
	);
}
