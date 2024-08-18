import { getUserId } from '$/lib/auth';
import { ActionsToolbar } from './actions-toolbar';
import { getUserCollectionsAction } from './actions';
import { Sidebar } from './sidebar';

export default async function ManagePage() {
	const userId = getUserId();
	const userCollections = await getUserCollectionsAction(userId!);

	const categoriesNames = userCollections.map((category) => category.name);

	return (
		<main>
			<ActionsToolbar />
			<Sidebar categories={categoriesNames} />
		</main>
	);
}
