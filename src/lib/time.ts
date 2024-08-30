export function convertMinutesToMilliseconds(minutes: number) {
	return minutes * 60 * 1000;
}

export function convertMillisecondsToMinutes(ms: number) {
	return ms / 60 / 1000;
}

export async function sleep(ms: number) {
	await new Promise((res) => setTimeout(res, ms));
}
