import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 200) {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const timeout = setTimeout(() => setDebouncedValue(value), delay);

		return () => {
			clearTimeout(timeout);
		};
	}, [value, delay]);

	return debouncedValue;
}
