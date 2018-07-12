import React, {ComponentLineChartTutorial} from 'react'
import {connect} from "react-redux";
import PropTypes from "prop-types";

import LineChart from "../components/LineChart"

import {timeParse} from "d3-time-format"
import {scaleTime, scaleLinear} from 'd3-scale';
import {max} from 'd3-array'

import 'bootstrap/dist/css/bootstrap.css';


const mapStateToProps = (state, ownProps) => ({
    chartData: ownProps.chartData,
    chartProperties: ownProps.chartProperties
});

const mapDispatchToProps = (dispatch, ownProps) => ({

});

export class ChartContainer extends Component {
    // ChartContainer defines all necessary properties to display the LineChart component
    static propTypes = {
        chartData: PropTypes.arrayOf(PropTypes.array).isRequired,
        chartProperties: PropTypes.object.isRequired
    };

    constructor(props){
        super(props);
        this.state = {currentPeriod: "LastMonth"};
        this.changePeriod = this.changePeriod.bind(this)
    }

    changePeriod(event) {
        let newPeriod = event.target.value;
        this.setState({currentPeriod: newPeriod})
    }

    getChartProperties() {
        const margin = {top: 20, right: 20, bottom: 30, left: 20},
            width = 600 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        const timeParser = timeParse("%d-%b-%y");

        // set the ranges
        let scaleX = scaleTime().range([0, width]);
        let scaleY = scaleLinear().range([height, 0]);

        let chartData = this.props.chartData;
        let startDate = null;

        let maxDate = timeParser(this.props.chartProperties.maxDate);
        let amountOfDays = 30;
        startDate = new Date(maxDate);
        startDate.setDate(startDate.getDate() - amountOfDays);
        scaleX.domain([startDate, maxDate]);

        let maxValues = [];
        for (let aa=0; aa<chartData.length; aa++) {
            maxValues.push(max(chartData[aa].filter(data => timeParser(data.date) > startDate), function(d) { return d.close; }))
        }
        let scaleYMaxOffset = 20.;
        let maxValue = max(maxValues) + scaleYMaxOffset;
        scaleY.domain([0, maxValue]);
        let xTimeFormat = "%d-%b-%y";
        let xTicksNumber = 1;

        return {"scaleX": scaleX, "scaleY": scaleY, "width": width, "height": height, "margin": margin,
                "xTimeFormat": xTimeFormat, "xTicksNumber": xTicksNumber}
    }

    render() {
        let chartProperties = this.getChartProperties();

        return (
            <div >
                <LineChart data={this.props.chartData}
                           scaleX={chartProperties["scaleX"]} scaleY={chartProperties["scaleY"]}
                           width={chartProperties["width"]} height={chartProperties["height"]}
                           margin={chartProperties["margin"]} xTimeFormat={chartProperties["xTimeFormat"]}
                           xTicksNumber={chartProperties["xTicksNumber"]}/>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ChartContainer);