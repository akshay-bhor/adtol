import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import PaperBlock from "./PaperBlock";

const chartContent = {
  display: "block",
  width: '100%',
  margin: "20px 10px",
};

const flattenData = (data) => {
  return Object.keys(data).map((key) => [
    key,
    data[key].earned,
  ]);
};

const RefEarningChart = (props) => {
  const gChartLoaded = useSelector((state) => state.script.g_charts);

  const loadChart = useCallback(() => {
    // Flatten data
    const cdata = flattenData(props.data);

    let data = new window.google.visualization.DataTable();
    data.addColumn("string");
    data.addColumn("number", "Earnings");

    data.addRows(cdata);

    let chartOptions = {
      chart: {
        title: "Last 2 Months",
      },
      series: {
        // Gives each series an axis name that matches the Y-axis below.
        0: { axis: "Earnings" },
      },
      axes: {
        // Adds labels to each axis; they don't have to match the axis names.
        y: {
          Views: { label: "Earnings" },
        },
      },
    };

    let materialChart = new window.google.charts.Line(document.getElementById('ref_stats_chart'));
    materialChart.draw(data, chartOptions);
  }, [props.data]);

  useEffect(() => {
    if (gChartLoaded) {
      window.google.charts.load("current", { packages: ["line", "corechart"] });
      window.google.charts.setOnLoadCallback(loadChart);
    }
  }, [gChartLoaded, loadChart]);

  return (
    <PaperBlock heading="Referral Statistics" fullWidth={true}>
      <div id="ref_stats_chart" style={chartContent}></div>
    </PaperBlock>
  );
};

export default RefEarningChart;
