export function objectKeys<TObj extends Record<string, any>>(obj: TObj): (keyof TObj)[] {
	return Object.keys(obj);
}
