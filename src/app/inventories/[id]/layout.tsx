import { Header } from '$/app/_header';
import { getUserInventories } from '$/data-access/inventories';
import { getUserIdFromCookie } from '$/lib/auth';
import { ReactNode } from 'react';

export default async function InventoriesLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: { id: string };
}) {
	const userId = getUserIdFromCookie()!;
	const inventories = await getUserInventories(userId);

	return (
		<>
			<Header inventories={inventories} activeInventoryId={params.id} />
			{children}
		</>
	);
}
