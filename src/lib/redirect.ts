export const AppRoutes = {
	AUTH: {
		SIGNUP: '/signup',
		LOGIN: '/login',
	},
	PAGES: {
		DASHBOARD: '/dashboard',
		INVENTORY: '/inventory', // TODO: remove this path
		USER: '/user',

		INVENTORIES: {
			BROWSE: '/inventories/:id/browse',
			MANAGE: '/inventories/:id/manage',
		},

		INVITE: {
			RESPONSE: '/invite/response', // this page expects a ?token=<invitation_token> query param
		},
	},
} as const;

type RoutePaths<T> = {
	[K in keyof T]: T[K] extends Record<string, any> ? RoutePaths<T[K]> : T[K];
}[keyof T];

export type AppRoutes = RoutePaths<typeof AppRoutes>;

export function replaceUrlPlaceholder(url: AppRoutes, replace: string[]) {
	return url.replace(/:[a-zA-Z]+/g, () => replace.shift()!);
}
