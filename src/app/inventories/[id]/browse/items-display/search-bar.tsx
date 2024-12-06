'use client';

import { Input } from '$/components/form/input';
import { useDebounce } from '$/hooks/useDebounce';
import { QueryParams, useQueryParams } from '$/hooks/useQueryParams';
import { cn } from '$/lib/utils';
import { GlobeIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SearchBar() {
	const { getQueryParam, updateQueryParams } = useQueryParams();
	const [search, setSearch] = useState(getQueryParam(QueryParams.SEARCH) || '');
	const debouncedSearch = useDebounce(search);

	const [isGlobalSearch, setIsGlobalSearch] = useState(false);

	useEffect(() => {
		updateQueryParams({
			[QueryParams.SEARCH]: debouncedSearch,
			[QueryParams.GLOBAL]: isGlobalSearch ? '1' : '0'
		});
	}, [updateQueryParams, debouncedSearch, isGlobalSearch]);

	return (
		<Input
			placeholder={isGlobalSearch ? 'Search all inventory...' : 'Search current category...'}
			className='text-md text-black placeholder:text-black'
			onChange={(e) => setSearch(e.target.value)}
			defaultValue={search}
			endIcon={(
				<GlobeIcon
					className={cn(
						'h-6 w-6 cursor-pointer',
						isGlobalSearch && 'text-blue-500'
					)}
					onClick={() => setIsGlobalSearch(!isGlobalSearch)}
				/>
			)}
		/>
	);
}
