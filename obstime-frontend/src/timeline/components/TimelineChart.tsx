import React, { useState } from "react";
import {
  XYPlot,
  LineSeries,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  DiscreteColorLegend,
  Crosshair,
} from "react-vis";
import "react-vis/dist/style.css";
import "./TimelineChart.css";

/**
 * Component to show the metrics in a chart.
 */
const TimelineChart = ({ data }: any) => {
  const [crosshairValues, setCrosshairValues] = useState<any>([]);

  const items = data?.map((item: any) => ({
    x: new Date(item.timestamp),
    y: item.average,
    title: item.name,
  }));

  return (
    <div>
      {data?.length ? (
        <>
          <XYPlot
            width={800}
            height={400}
            onMouseLeave={() => setCrosshairValues([])}
          >
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis
              title="Timestamp"
              tickFormat={(v) => new Date(v).toLocaleString()}
              tickTotal={5}
            />
            <YAxis title="Metric Value" />
            <LineSeries
              data={items}
              onNearestX={(datapoint, event) => setCrosshairValues([datapoint])}
            />
            <DiscreteColorLegend
              items={[{ title: "Metric" }]}
              orientation="horizontal"
              className="timeline-legend"
            />
            <Crosshair values={crosshairValues} />
          </XYPlot>
        </>
      ) : (
        <div>No Data Available</div>
      )}
    </div>
  );
};

export default TimelineChart;
