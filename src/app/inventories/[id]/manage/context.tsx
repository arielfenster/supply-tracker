'use client';

import { InventoryMember } from '$/data-access/inventories';
import { Inventory, Invite, User, UserRole } from '$/db/schemas';
import { PropsWithChildren, createContext, useContext } from 'react';

type ManagePageProviderValue = {
	inventory: Inventory;
	members: InventoryMember[];
	currentMember: InventoryMember;
	pendingInvites: { invite: Invite; recipient: User; role: UserRole }[];
};

const ManagePageContext = createContext<ManagePageProviderValue | null>(null);

export function ManagePageProvider({
	children,
	...contextValues
}: ManagePageProviderValue & PropsWithChildren) {
	return <ManagePageContext.Provider value={contextValues}>{children}</ManagePageContext.Provider>;
}

export function useManagePageContext() {
	const value = useContext(ManagePageContext);
	if (!value) {
		throw new Error("useManagePageContext can't be used without ManagePageProvider");
	}

	return value;
}
