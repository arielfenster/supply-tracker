export function isOnlyOneDefined(values: [any, any]) {
	const [val1, val2] = values;
	return (val1 && !val2) || (val2 && !val1);
}
