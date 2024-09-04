'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const QueryParams = {
	CATEGORY: 'cat',
	SUBCATEGORY: 'sub',
} as const;

export type QueryParams = (typeof QueryParams)[keyof typeof QueryParams];

export function useQueryParams() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	function updateQueryParams(params: Partial<Record<QueryParams, string>>) {
		const queryParams = new URLSearchParams(searchParams);

		Object.keys(params).forEach((key) => {
			const value = params[key as keyof typeof params];
			if (value) {
				queryParams.set(key, value);
			} else {
				queryParams.delete(key);
			}
		});

		router.replace(`${pathname}?${queryParams.toString()}`);
	}

	function getQueryParam(name: QueryParams) {
		return searchParams.get(name);
	}

	return {
		updateQueryParams,
		getQueryParam,
	};
}
