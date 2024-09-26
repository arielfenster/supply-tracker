export function convertMinutesToMilliseconds(minutes: number) {
	return minutes * 60 * 1000;
}

export function convertMillisecondsToMinutes(ms: number) {
	return ms / 60 / 1000;
}

export async function sleep(ms: number) {
	await new Promise((res) => setTimeout(res, ms));
}

type SchemaDate = `${string}-${string}-${string}`;
type SchemaTime = `${string}:${string}:${string}`;
type SchemaTimestamp = `${SchemaDate} ${SchemaTime}`;

type InputTimestamps = {
	createdAt: string;
	updatedAt: string;
};

export function getTimestampDate(obj: InputTimestamps, field: keyof InputTimestamps): SchemaDate {
	const timestamp = obj[field] as SchemaTimestamp;
	return timestamp.split(' ')[0] as SchemaDate;
}

export function getTimestampTime(obj: InputTimestamps, field: keyof InputTimestamps): SchemaTime {
	const timestamp = obj[field] as SchemaTimestamp;
	return timestamp.split(' ')[1] as SchemaTime;
}
