export function getCurrentTimestamp() {
	return Intl.DateTimeFormat('en-GB', {
		dateStyle: 'short',
		timeStyle: 'short',
	}).format();
}

export function generateTimestamps() {
	const currentTimestamp = getCurrentTimestamp();

	return {
		createdAt: currentTimestamp,
		updatedAt: currentTimestamp,
	};
}
