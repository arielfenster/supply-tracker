'use client';

import { useDebounce } from '$/app/_hooks/useDebounce';
import { QueryParams, useQueryParams } from '$/app/_hooks/useQueryParams';
import { Input } from '$/components/form/input';
import { useEffect, useState } from 'react';

interface SearchBarProps {}

export function SearchBar({}: SearchBarProps) {
	const { getQueryParam, updateQueryParams } = useQueryParams();
	const [search, setSearch] = useState(getQueryParam(QueryParams.SEARCH) || '');
	const debouncedSearch = useDebounce(search);

	useEffect(() => {
		updateQueryParams({ [QueryParams.SEARCH]: debouncedSearch });
	}, [updateQueryParams, debouncedSearch]);

	return (
		<Input
			placeholder='Search items...'
			className='text-md text-black placeholder:text-black'
			onChange={(e) => setSearch(e.target.value)}
			defaultValue={search}
		/>
	);
}
