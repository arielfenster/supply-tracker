import { Header } from '$/components/header';
import { getUserIdFromCookie } from '$/services/auth/session.service';
import { getInventoriesUserIsEligibleToView } from '$/services/inventories.service';
import { ReactNode } from 'react';

export default async function InventoriesLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: { id: string };
}) {
	const userId = getUserIdFromCookie()!;
	const inventories = await getInventoriesUserIsEligibleToView(userId);

	return (
		<>
			<Header inventories={inventories} activeInventoryId={params.id} />
			{children}
		</>
	);
}
