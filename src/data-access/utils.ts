import { SQL, sql } from 'drizzle-orm';

// type TimestampsPayload = { createdAt: SQL; updatedAt: SQL };
type TimestampsPayload = { createdAt: string; updatedAt: string };

export function addCurrentTimestamps<T>(obj: T): T & TimestampsPayload {
	const currentTime = new Date().toISOString();

	return {
		...obj,
		// createdAt: sql`(CURRENT_TIMESTAMP)`,
		// updatedAt: sql`(CURRENT_TIMESTAMP)`,
		createdAt: currentTime,
		updatedAt: currentTime,
	};
}

export function getCurrentTimestamps(): TimestampsPayload {
	const currentTime = new Date().toISOString();

	return {
		createdAt: currentTime,
		updatedAt: currentTime,
	};
}
