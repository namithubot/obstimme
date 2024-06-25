import "react-vis/dist/style.css";
import TimelineChart from "./components/TimelineChart";
import { Interval } from "./models/constants";
import { useEffect, useState } from "react";
import {
  fetchTimelineData,
  fetchMetricsList,
} from "./services/Timeline.service";
import { Metric } from "./models/metric.model";
import "./Timeline.css";

/**
 * React components to show timeline data for metrics.
 *
 * @returns Timeline Component
 */
const Timeline = () => {
  const [timeInterval, setTimeInterval] = useState<Interval>(Interval.DAYS);
  const [metricsData, setMetricsData] = useState<Metric[]>([]);
  const [selectedMetric, setSelectedMetric] = useState("");
  const [availableMetrics, setAvailableMetrics] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("2023-06-01T00:00");
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 16));

  // Update the timeline data whenever the selections change.
  useEffect(() => {
    async function updateTimelineData() {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const timelineData = await fetchTimelineData(
        start,
        end,
        timeInterval,
        [selectedMetric || "tat"]
      );
      setMetricsData(timelineData.averages);
    }

    async function loadMetricsList() {
      const metricsList = await fetchMetricsList();
      setAvailableMetrics(metricsList.metrics);
      setSelectedMetric(metricsList.metrics?.[0]);
    }

    // Load metrics only once.
    if (!availableMetrics.length) {
      loadMetricsList();
    }

    updateTimelineData();
  }, [timeInterval, selectedMetric, startDate, endDate]);

  return (
    <div>
      {!availableMetrics?.length ? (
        <>
          <div>No metric data available</div>
        </>
      ) : (
        <>
          <div className="timeline-controls">
            <label>
              Start Date:
              <input
                type={timeInterval === Interval.DAYS ? "date" : "datetime-local"}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label>
              End Date:
              <input
                type={timeInterval === Interval.DAYS ? "date" : "datetime-local"}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>
          <div className="timeline-controls">
            <label>
              Metric:
              <select
                value={selectedMetric}
                className="timeline-option"
                onChange={(e) => setSelectedMetric(e.target.value)}
              >
                {availableMetrics.map((metric) => (
                  <option key={metric} value={metric}>
                    {metric}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Time Interval:
              <select
                value={timeInterval}
                className="timeline-option"
                onChange={(e) => setTimeInterval(Number.parseInt(e.target.value))}
              >
                <option value={Interval.MINUTES}>Minutes</option>
                <option value={Interval.HOURS}>Hours</option>
                <option value={Interval.DAYS}>Days</option>
              </select>
            </label>
          </div>
          <TimelineChart data={metricsData} />
        </>
      )}
    </div>
  );
};

export default Timeline;
