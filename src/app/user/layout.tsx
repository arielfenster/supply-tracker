import { Header } from '$/app/_header';
import { getUserInventories } from '$/data-access/inventories';
import { getUserIdFromCookie } from '$/lib/auth';
import { ReactNode } from 'react';

export default async function UserLayout({ children }: { children: ReactNode }) {
	const userId = getUserIdFromCookie()!;
	const inventories = await getUserInventories(userId);

	return (
		<>
			<Header inventories={inventories} activeInventoryId={null} />
			{children}
		</>
	);
}
