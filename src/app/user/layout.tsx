import { Header } from '$/components/header';
import { getUserIdFromCookie } from '$/lib/auth';
import { getInventoriesUserIsEligibleToView } from '$/services/inventories.service';
import { ReactNode } from 'react';

export default async function UserLayout({ children }: { children: ReactNode }) {
	const userId = getUserIdFromCookie()!;
	const inventories = await getInventoriesUserIsEligibleToView(userId);

	return (
		<>
			<Header inventories={inventories} activeInventoryId={null} />
			{children}
		</>
	);
}
