import { redirect } from 'next/navigation';

export const AppRoutes = {
	AUTH: {
		SIGNUP: '/signup',
		LOGIN: '/login',
	},
	PAGES: {
		BROWSE: '/browse',
		MANAGE: '/manage',
	},
} as const;

type RoutePaths<T> = {
	[K in keyof T]: T[K] extends Record<string, any> ? RoutePaths<T[K]> : T[K];
}[keyof T];

export type AppRoutes = RoutePaths<typeof AppRoutes>;

export function appRedirect(route: AppRoutes) {
	return redirect(route);
}
