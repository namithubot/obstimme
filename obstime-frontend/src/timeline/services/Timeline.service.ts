import { Interval, IntervalGranularityMap } from "../models/constants";
import { MetricListResponseModel } from "../models/metric-list-response.model";
import { TimelineResponse } from "../models/timeline-response.model";

/**
 * Method to get the average metric data based on the filters.
 * 
 * @param start Starting datetime
 * @param end Ending datetime
 * @param interval Interval of the data
 * @param metrics Name of the metrics
 * @returns Metric data reported to the server.
 */
export async function fetchTimelineData(
  start: Date,
  end: Date,
  interval: Interval,
  metrics: string[]
): Promise<TimelineResponse> {
  const options = { method: "GET" };
  const searchParams = new URLSearchParams({
    start: start.toISOString(),
    end: end.toISOString(),
    granularity: IntervalGranularityMap[interval],
  });

  metrics.forEach((metric) => searchParams.append("name", metric));

  const response = await fetch(
    "http://127.0.0.1:5000/metrics/average?" + searchParams.toString(),
    options
  );

  return response.json();
}

/**
 * Lists all the metrics available at the server.
 * 
 * @returns List of available metrics
 */
export async function fetchMetricsList(): Promise<MetricListResponseModel> {
	const response = await fetch("http://127.0.0.1:5000/metrics/list");
	return response.json();
}