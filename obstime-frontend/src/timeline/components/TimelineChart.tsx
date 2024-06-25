import "./TimelineChart.css";
import Chart from "react-google-charts";

/**
 * Component to show the metrics in a chart.
 */
const TimelineChart = ({ data }: any) => {

  const items = data?.map((item: any) => ({
    x: new Date(item.timestamp),
    y: item.average,
    title: item.name,
  }));

  
  const chartData = [
    ...[['Time', 'Value']],
    ...items?.map((item: any) => [item.x, item.y])
  ];

  const options = {
    title: "Metric Vizualizer",
    curveType: "function",
    series: [{ color: "#E7711B" }],
    intervals: { style: "area" },
    legend: "none",
  };

  return (
    <div>
      {data?.length ? (
        <>
          <Chart
            chartType="LineChart"
            width="100%"
            height="400px"
            data={chartData}
            options={options}
          />
        </>
      ) : (
        <div>No Data Available</div>
      )}
    </div>
  );
};

export default TimelineChart;
