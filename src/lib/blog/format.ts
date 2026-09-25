function toDate(isoDay: string): Date {
	return new Date(`${isoDay}T00:00:00Z`);
}

/** "Sep 24, 2026" — always in UTC so a post's date never shifts by timezone. */
export function formatDate(isoDay: string): string {
	return toDate(isoDay).toLocaleDateString('en-US', {
		timeZone: 'UTC',
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}

/** "SEP 24" for compact list rows. */
export function formatDayMonth(isoDay: string): string {
	return toDate(isoDay)
		.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: '2-digit' })
		.toUpperCase();
}

export function yearOf(isoDay: string): string {
	return isoDay.slice(0, 4);
}

/** RFC 822 date for RSS. */
export function toRfc822(isoDay: string): string {
	return toDate(isoDay).toUTCString();
}

export function tagSlug(name: string): string {
	return name
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}
