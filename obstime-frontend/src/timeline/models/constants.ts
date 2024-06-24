/**
 * Denotes the interval of the data
 * to be shown
 */
export enum Interval
{
	MINUTES,
	HOURS,
	DAYS
}

/**
 * Map to convert Interval to Granularity
 * which is used by APIs.
 */
export const IntervalGranularityMap = {
	[Interval.DAYS]: 'days',
	[Interval.HOURS]: 'hours',
	[Interval.MINUTES]: 'minutes'
}
