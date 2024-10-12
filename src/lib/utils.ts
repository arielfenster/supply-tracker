import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function objectKeys<TObj extends Record<string, any>>(obj: TObj): (keyof TObj)[] {
	return Object.keys(obj);
}

export function objectValues<TObj extends Record<string, string>>(
	obj: TObj,
): [string, ...string[]] {
	return Object.values(obj) as any;
}

export function isOnlyOneDefined(values: [any, any]) {
	const [val1, val2] = values;
	return (val1 && !val2) || (val2 && !val1);
}
