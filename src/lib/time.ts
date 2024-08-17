export function convertMinutesToMilliseconds(minutes: number) {
	return minutes * 60 * 1000;
}

export function convertMillisecondsToMinutes(ms: number) {
	return ms / 60 / 1000;
}
