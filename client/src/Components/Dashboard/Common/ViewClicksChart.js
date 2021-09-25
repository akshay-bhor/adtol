import { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import PaperBlock from "./PaperBlock";

const chartContent = {
  display: "block",
  width: '100%',
  margin: "20px 10px",
};

const flattenData = (data) => {
  if(typeof data !== 'object') return null;
  return Object.keys(data).map((key) => [
    key,
    +data[key].views,
    +data[key].clicks,
  ]);
};

const ViewClicksChart = (props) => {
  const gChartLoaded = useSelector((state) => state.script.g_charts);
  const chartRef = useRef();

  const loadChart = useCallback(() => {
    // Flatten data
    const cdata = flattenData(props.data);

    // Check empty
    if(cdata === null) return;

    let data = new window.google.visualization.DataTable();
    data.addColumn("string");
    data.addColumn("number", "Views");
    data.addColumn("number", "Clicks");

    data.addRows(cdata);

    let chartOptions = {
      chart: {
        title: props.title ? props.title : "Last 7 days",
      },
      series: {
        // Gives each series an axis name that matches the Y-axis below.
        0: { axis: "Views" },
        1: { axis: "Clicks" },
      },
      axes: {
        // Adds labels to each axis; they don't have to match the axis names.
        y: {
          Views: { label: "Views" },
          Clicks: { label: "Clicks" },
        },
      },
    };

    let materialChart = new window.google.charts.Line(chartRef.current);
    materialChart.draw(data, chartOptions);
  }, [props.data]);

  useEffect(() => {
    if (gChartLoaded) {
      window.google.charts.load("current", { packages: ["line", "corechart"] });
      window.google.charts.setOnLoadCallback(loadChart);
    }
  }, [gChartLoaded, loadChart]);

  return (
    <PaperBlock heading="By Date" fullWidth={props.fullWidth ? true : false}>
      <div ref={chartRef} id="ad_view_clicks_chart" style={chartContent}></div>
    </PaperBlock>
  );
};

export default ViewClicksChart;
