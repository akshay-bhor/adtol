import { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import PaperBlock from "./PaperBlock";

const chartContent = {
  display: "block",
  width: "100%",
  minHeight: '400px',
  margin: "20px 10px",
};

const flattenData = (data) => {
  // Check if not all zero
  if(typeof data !== 'object') return [];
  const check = Object.keys(data).filter((key) => data[key].clicks > 0);
  if(check.length === 0) return [];
  return Object.keys(data).map((key) => [
    key,
    +data[key].clicks,
  ]);
};

const PieChart = (props) => {
  const gChartLoaded = useSelector((state) => state.script.g_charts);
  const pie_chart = useRef();

  const loadChart = useCallback(() => {
    // Flatten data
    const cdata = flattenData(props.data);

    // If non-empty reponse from api
    if (cdata.length > 0) {
      let data = window.google.visualization.arrayToDataTable([
        props.cols,
        ...cdata,
      ]);

      let options = {
        slices: {
          1: { offset: 0.2 },
          2: { offset: 0.3 },
        }
      };

      let chart = new window.google.visualization.PieChart(pie_chart.current);

      chart.draw(data, options);
    } else {
      if (pie_chart.current) pie_chart.current.innerText = "No Data Available!";
    }
  }, [props.data, pie_chart]);

  useEffect(() => {
    if (gChartLoaded) {
      window.google.charts.load("current", { packages: ["corechart"] });
      window.google.charts.setOnLoadCallback(loadChart);
    }
  }, [gChartLoaded, loadChart]);

  return (
    <PaperBlock heading={props.heading} subheading={props.subheading}>
      <div id="pie_chart" ref={pie_chart} style={chartContent}></div>
    </PaperBlock>
  );
};

export default PieChart;
