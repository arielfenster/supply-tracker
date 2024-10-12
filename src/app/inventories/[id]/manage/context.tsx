'use client';

import { InventoryMember } from '$/data-access/inventories';
import { PropsWithChildren, createContext, useContext } from 'react';

type ManagePageProviderValue = {
	members: InventoryMember[];
	currentMember: InventoryMember;
};

const ManagePageContext = createContext<ManagePageProviderValue | null>(null);

export function ManagePageProvider({
	members,
	currentMember,
	children,
}: ManagePageProviderValue & PropsWithChildren) {
	return (
		<ManagePageContext.Provider value={{ members, currentMember }}>
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
