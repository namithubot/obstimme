import { Metric } from "./metric.model";

/**
 * The response for metric list data from the APIs.
 */
export interface MetricListResponseModel {
	/**
	 * List of available metrics.
	 */
	metrics: string[];
}