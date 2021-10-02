import PaperBlock from "../../Common/PaperBlock";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useRef } from "react";

const chartContent = {
  display: "block",
  width: '100%',
  margin: "20px 0",
}

const AdUnits = (props) => {
    const gChartLoaded = useSelector((state) => state.script.g_charts);
    const chartRef = useRef();

    const loadChart = useCallback(() => {
        let data = window.google.visualization.arrayToDataTable([
            ['Device', 'Clicks'],
            ['Desktop', +props.data.Desktop.clicks],
            ['Mobile', +props.data.Mobile.clicks],
            ['Tablet', +props.data.Tablet.clicks],
          ]);
  
        let options = {
            pieHole: 0.4,
        };
  
        let chart = new window.google.visualization.PieChart(chartRef.current);
  
        chart.draw(data, options);
    }, [props.data])

    useEffect(() => {
        if(gChartLoaded) {
            window.google.charts.load('current', {'packages':['corechart']});
            window.google.charts.setOnLoadCallback(loadChart);
        }

    }, [gChartLoaded, loadChart]);

    return (
        <PaperBlock heading="Platforms" subheading="Today">
            <div ref={chartRef} id="devices_chart" style={chartContent}></div> 
        </PaperBlock>
    );
}

export default AdUnits;