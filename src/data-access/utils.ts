type TimestampsPayload = { createdAt: string; updatedAt: string };

export function getCurrentTimestamps(): TimestampsPayload {
	const currentTime = new Date().toISOString();

	return {
		createdAt: currentTime,
		updatedAt: currentTime,
	};
}
