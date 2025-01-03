import { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { MAPS_API_KEY } from "../../../util/load-scripts";
import PaperBlock from "./PaperBlock";

const chartContent = {
  display: "block",
  width: '100%',
  minHeight: '420px',
  margin: "20px 10px",
};

const flattenData = (data) => { 
  if(typeof data !== 'object') return [];
  return Object.keys(data).map((key) => [
    key,
    +data[key].clicks,
    data[key].spent !== undefined ? +data[key].spent 
    : data[key].earned !== undefined ? +data[key].earned
    : +data[key].cost
  ]);
};

const GeoChart = (props) => {
  const gChartLoaded = useSelector((state) => state.script.g_charts);
  const geo_chart = useRef();

  const loadChart = useCallback(() => {
    // Flatten data
    const cdata = flattenData(props.data);
    
    // If non-empty reponse from api
    if(cdata.length > 0) {
      let data = window.google.visualization.arrayToDataTable([
          props.cols,
          ...cdata
        ]);

      let options = {};

      let chart = new window.google.visualization.GeoChart(geo_chart.current);

      chart.draw(data, options);
    }
    else {
      if(geo_chart.current) geo_chart.current.innerText = 'No Data Available!';
    }
  }, [props.data, geo_chart]);

  useEffect(() => {
    if (gChartLoaded) {
        window.google.charts.load('current', {
            'packages':['geochart']
          });
        window.google.charts.setOnLoadCallback(loadChart);
    }
  }, [gChartLoaded, loadChart]);

  return (
    <PaperBlock heading="By Country">
      <div id="geo_chart" ref={geo_chart} style={chartContent}></div>
    </PaperBlock>
  );
};

export default GeoChart;
