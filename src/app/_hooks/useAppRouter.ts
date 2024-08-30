'use client';

import { AppRoutes, replaceUrlPlaceholder } from '$/lib/redirect';
import { useRouter } from 'next/navigation';

export function useAppRouter() {
	const router = useRouter();

	function push(url: AppRoutes, replaceValues: string[] = []) {
		const transformed = replaceUrlPlaceholder(url, replaceValues);
		router.push(transformed);
	}

	const appRouter = {
		...router,
		push,
	};

	return appRouter;
}
