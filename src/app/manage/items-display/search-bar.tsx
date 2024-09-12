'use client';

import { QueryParams, useQueryParams } from '$/app/_hooks/useQueryParams';
import { Input } from '$/components/form/input';
import { useEffect, useState } from 'react';

interface SearchBarProps {}

export function SearchBar({}: SearchBarProps) {
	const { getQueryParam, updateQueryParams } = useQueryParams();
	const [search, setSearch] = useState(getQueryParam(QueryParams.SEARCH) || '');

	useEffect(() => {
		updateQueryParams({ [QueryParams.SEARCH]: search });
	}, [search, updateQueryParams]);

	return (
		<Input
			placeholder='Search items...'
			className='text-md text-black placeholder:text-black'
			onChange={(e) => setSearch(e.target.value)}
		/>
	);
}
