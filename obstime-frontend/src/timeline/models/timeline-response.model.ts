import { Metric } from "./metric.model";

/**
 * The response for average data from the APIs.
 */
export interface TimelineResponse {
	/**
	 * List of average data for the grouped metrics.
	 */
	averages: Metric[];
}