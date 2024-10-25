import { cookies } from 'next/headers';
import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';
import { AppRoutes } from './lib/redirect';

const protectedRoutes = [
	AppRoutes.PAGES.__ROOT,
	AppRoutes.PAGES.DASHBOARD,
	AppRoutes.PAGES.USER,
	AppRoutes.PAGES.INVENTORIES.BROWSE,
	AppRoutes.PAGES.INVENTORIES.MANAGE,
];

const accessControlRoutes = [AppRoutes.AUTH.LOGIN, AppRoutes.AUTH.SIGNUP];

export default async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.some((route) => route.match(path));
	const isAccessControlRoute = accessControlRoutes.some((route) => route.match(path));

	const isUserLoggedIn = cookies().has('user_session');

	if (isProtectedRoute && !isUserLoggedIn) {
		return NextResponse.redirect(new URL(AppRoutes.AUTH.LOGIN, req.nextUrl));
	}

	if (isAccessControlRoute && isUserLoggedIn) {
		return NextResponse.redirect(new URL(AppRoutes.PAGES.DASHBOARD, req.nextUrl));
	}

	return NextResponse.next();
}

export const config: MiddlewareConfig = {
	matcher: [
		'/',
		'/dashboard',
		'/user',
		'/inventories/:id/:browse',
		'/inventories/:id/:manage',

		'/login',
		'/signup',
	],
};
