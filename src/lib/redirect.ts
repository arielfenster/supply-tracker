import { redirect } from 'next/navigation';

export const AppRoutes = {
	AUTH: {
		SIGNUP: '/signup',
		LOGIN: '/login',
	},
	PAGES: {
		DASHBOARD: '/dashboard',
		MANAGE: '/manage',
		INVENTORY: '/inventory',
		USER: '/user',

		INVENTORIES: {
			BROWSE: '/inventory/:id/:browse',
			MANAGE: '/inventory/:id/:manage',
		}, // TODO: rename to inventory
	},
} as const;

type RoutePaths<T> = {
	[K in keyof T]: T[K] extends Record<string, any> ? RoutePaths<T[K]> : T[K];
}[keyof T];

export type AppRoutes = RoutePaths<typeof AppRoutes>;

export function appRedirect(route: AppRoutes) {
	return redirect(route);
}

export function replaceUrlPlaceholder(url: AppRoutes, replace: string[]) {
	return url.replace(/:[a-zA-Z]+/g, () => replace.shift()!);
}

/**
 * 1. dashboard page - a summary of the user's inventories (if he has any).
 * each item will be a card with the inventory name, (number of users?), and a line that represents the summary of the inventory - how many items are in stock, low quantity, danger quantity or out of stock,
 * painted in green -> orange -> red -> black.
 * the item is clickable and will redirect the user to that inventory.
 * there will also be a button to create a new inventory
 * if the user doesn't have any inventories, he will only see the button to create a new one.
 * the form to create new inventory should be very small - only name, and be in the same page without navigation. either a dialog form or a simple input element
 * 
 * 2. 
 */
