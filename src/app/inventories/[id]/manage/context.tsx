'use client';

import { InventoryMember } from '$/data-access/inventories';
import { Invite, User } from '$/db/schemas';
import { PropsWithChildren, createContext, useContext } from 'react';

type ManagePageProviderValue = {
	members: InventoryMember[];
	currentMember: InventoryMember;
	pendingInvitations: (Invite & { recipient: User })[];
};

const ManagePageContext = createContext<ManagePageProviderValue | null>(null);

export function ManagePageProvider({
	members,
	currentMember,
	pendingInvitations,
	children,
}: ManagePageProviderValue & PropsWithChildren) {
	return (
		<ManagePageContext.Provider value={{ members, currentMember, pendingInvitations }}>
			{children}
		</ManagePageContext.Provider>
	);
}

export function useManagePageContext() {
	const value = useContext(ManagePageContext);
	if (!value) {
		throw new Error("useManagePageContext can't be used without ManagePageProvider");
	}

	return value;
}
