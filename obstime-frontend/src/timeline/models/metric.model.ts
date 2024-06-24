/**
 * Metric data for single metric entry.
 */
export interface Metric
{
	/**
	 * Average value of the grouped data.
	 */
	average: number,
	
	/**
	 * Name of the metric.
	 */
	name: string,

	/**
	 * Timestamp of the metric.
	 */
	timestamp: string
}
