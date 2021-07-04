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
    data[key].clicks,
    data[key].spent || data[key].earned
  ]);
};

const GeoChart = (props) => {
  const gChartLoaded = useSelector((state) => state.script.g_charts);

  const loadChart = useCallback(() => {
    // Flatten data
    const cdata = flattenData(props.data);

    let data = window.google.visualization.arrayToDataTable([
        props.cols,
        ...cdata
      ]);

    let options = {};

    let chart = new window.google.visualization.GeoChart(document.getElementById('geo_chart'));

    chart.draw(data, options);
  }, [props.data]);

  useEffect(() => {
    if (gChartLoaded) {
        window.google.charts.load('current', {
            'packages':['geochart'],
            'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
          });
        window.google.charts.setOnLoadCallback(loadChart);
    }
  }, [gChartLoaded, loadChart]);

  return (
    <PaperBlock heading="By Country">
      <div id="geo_chart" style={chartContent}></div>
    </PaperBlock>
  );
};

export default GeoChart;
