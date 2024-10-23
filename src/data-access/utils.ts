type TimestampsPayload = { createdAt: string; updatedAt: string };

export function getCurrentTimestamps(): TimestampsPayload {
	const currentTimestamp = Intl.DateTimeFormat('en-GB', {
		dateStyle: 'short',
		timeStyle: 'short',
	}).format();

	return {
		createdAt: currentTimestamp,
		updatedAt: currentTimestamp,
	};
}
