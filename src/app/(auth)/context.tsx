'use client';

import { User, UserRole } from '$/db/schemas';
import { PropsWithChildren, createContext, useContext } from 'react';

export type AuthContextProviderValue = {
    user: User & {role: UserRole};
};

const AuthContext = createContext<AuthContextProviderValue | null>(null);

export function AuthContextProvider({
    user,
	children,
}: AuthContextProviderValue & PropsWithChildren) {
	return <AuthContext.Provider value={{user}}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
	const value = useContext(AuthContext);
	if (!value) {
		throw new Error("useAuthContext can't be used without AuthContextProvider");
	}

	return value;
}
