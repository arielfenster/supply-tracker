'use client';

import { AppRoutes } from '$/lib/redirect';
// import { AppRoutes, replaceUrlPlaceholder } from '$/utils/redirect';
import { useRouter } from 'next/navigation';

export function useAppRouter() {
	const router = useRouter();

	function push(url: AppRoutes, replaceValues: string[] = []) {
		// const transformed = replaceUrlPlaceholder(url, replaceValues);
		router.push(url);
	}

	const appRouter = {
		...router,
		push,
	};

	return appRouter;
}
