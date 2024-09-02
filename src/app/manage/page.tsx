import { getUserId } from '$/lib/auth';
import { AppRoutes, appRedirect } from '$/lib/redirect';
import { isLoggedIn } from '$/page-guards/is-logged-in';
import { getUserInventoryAction } from './actions';
import { ManageContainer } from './container';

export default async function ManagePage() {
	if (!isLoggedIn()) {
		appRedirect(AppRoutes.AUTH.LOGIN);
	}

	const userId = getUserId();
	const inventory = await getUserInventoryAction(userId!);

	return (
		<main>
			<ManageContainer inventory={inventory} />
		</main>
	);
}
