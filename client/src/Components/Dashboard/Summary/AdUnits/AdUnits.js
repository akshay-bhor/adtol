import PaperBlock from "../../Common/PaperBlock";
import { useSelector } from "react-redux";
import { useCallback, useEffect, useRef } from "react";

const chartContent = {
  display: "block",
  width: '100%',
  margin: "20px 10px",
}

const AdUnits = (props) => {
    const gChartLoaded = useSelector((state) => state.script.g_charts);
    const chartRef = useRef();

    const loadChart = useCallback(() => {
        let data = window.google.visualization.arrayToDataTable([
            ['Ad Unit', 'Today', 'Yesterday'],
            ['Text', +props.data.text[0], +props.data.text[1]],
            ['Banner', +props.data.banner[0], +props.data.banner[1]],
            ['Native', +props.data.native[0], +props.data.native[1]],
            ['Widget', +props.data.widget[0], +props.data.widget[1]],
          ]);
  
        let options = {
            bars: 'horizontal' 
        };
  
        let chart = new window.google.charts.Bar(chartRef.current);
  
        chart.draw(data, window.google.charts.Bar.convertOptions(options));
    }, [props.data])

    useEffect(() => {
        if(gChartLoaded) {
            window.google.charts.load('current', {'packages':['bar']});
            window.google.charts.setOnLoadCallback(loadChart);
        }

    }, [gChartLoaded, loadChart]);

    return (
        <PaperBlock heading="Ad Units" subheading="Today vs Yesterday">
            <div ref={chartRef} id="ad_unit_chart" style={chartContent}></div> 
        </PaperBlock>
    );
}

export default AdUnits;