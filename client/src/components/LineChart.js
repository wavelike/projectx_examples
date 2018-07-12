import React, { Component } from 'react'
import PropTypes from "prop-types";

import { select } from 'd3-selection'
import * as timeFormat from "d3-time-format"
import {axisBottom, axisLeft} from "d3-axis"
import {timeWeek} from "d3-time"
import * as shape from "d3-shape"

import "../../../css/lineChart.css"


class LineChart extends Component {
    static propTypes = {
        scaleX: PropTypes.func.isRequired,
        scaleY: PropTypes.func.isRequired,
        margin: PropTypes.object.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        xTimeFormat: PropTypes.string.isRequired,
        xTicksNumber: PropTypes.number.isRequired
    };

    constructor(props){
        super(props);
        this.createLineChart = this.createLineChart.bind(this);
        this.updateLineChart = this.updateLineChart.bind(this);
    }

    componentDidMount() {
        this.createLineChart()
    }

    componentDidUpdate() {
        this.updateLineChart()
    }

    // Creates the whole chart including svg, clip path and axes
    createLineChart() {
        // LineChart uses D3.js to draw the stock price time series
        const node = this.node;
        let data = JSON.parse(JSON.stringify(this.props.data));

        const timeParser = timeFormat.timeParse("%d-%b-%y");
        let x = this.props.scaleX;
        let y = this.props.scaleY;
        let margin = this.props.margin;
        let width = this.props.width;
        let height = this.props.height;

        let xAxis = axisBottom(x);
        xAxis.ticks(timeWeek, this.props.xTicksNumber)
            .tickFormat(timeFormat.timeFormat(this.props.xTimeFormat));

        let lineFunction = shape.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.close); });

        // append the svg obgect to the body of the page
        let svg = select(node)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // The lines will be drawn in the ‘plotArea’ - a group element which references a clipPath.
        // The clipPath contains a rect with dimensions equal to the inner dimensions of the chart.
        // This will ensure that data points outside of the x-domain are not shown.
        let clipPath = svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height).attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Draw lines for each dataset in data
        let colour = ["#ffb3b3", "#ff1a8c", "#99ff66", "#3399ff", "#40bf40", "#ff80ff"];
        let dataset = null;
        for (let ii=0; ii<data.length; ii++) {
            dataset = data[ii];

            // format the data
            dataset.forEach(function(d) {
                d.date = timeParser(d.date);
                d.close = +d.close;
            });

            // createSet assigns each data point to one svg path element
            let createSet = svg.selectAll("pathid" + ii)
                .data([dataset], function(d) { return d});

            // remove path elements which dont have any data points assigned anymore
            createSet.exit()
                .remove();

            // Create new path elements for each new data point
            createSet.enter()
                .append("path")
                .attr("d", lineFunction)
                .attr("fill", "none")
                .attr("stroke", colour[ii])
                .attr("class", "path" + " pathid" + ii)
                .attr("clip-path", "url(#clip)");
        }

        // Add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "scaleX")
            .call(xAxis);  // Use scale for axis element

        // Add the Y Axis
        svg.append("g")
            .attr("class", "scaleY")
            .call(axisLeft(y));
    }

    updateLineChart() {
        const node = this.node;
        let svg = select(node);

        let x = this.props.scaleX;
        let y = this.props.scaleY;
        let margin = this.props.margin;
        let width = this.props.width;
        let height = this.props.height;

        // Update of x and y axes
        let xAxis = axisBottom(x);
        xAxis.ticks(timeWeek, this.props.xTicksNumber)
            .tickFormat(timeFormat.timeFormat(this.props.xTimeFormat));

        svg.select(".scaleX")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        // Create new Y axis
        svg.select(".scaleY")
            .call(axisLeft(y));

        // make hard copy of data since it will be modified later
        let data = JSON.parse(JSON.stringify(this.props.data));
        const parseTime = timeFormat.timeParse("%d-%b-%y");

        let lineFunction = shape.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.close); });

        // Draw lines for each dataset in data
        let colour = ["#ffb3b3", "#ff1a8c", "#99ff66", "#3399ff", "#40bf40", "#ff80ff"];
        svg.selectAll(".path").remove(); // remove all existing svg path classes
        let dataset = null;
        for (let ii=0; ii<data.length; ii++) {
            dataset = data[ii];

            // format the data
            dataset.forEach(function(d) {
                d.date = parseTime(d.date);
                d.close = +d.close;
            });

            // updateSet assigns each data point to one svg path element
            let updateSet = svg.selectAll(".pathid" + ii)
                .data([dataset], function(d) { return d});

            // remove path elements which dont have any data points assigned anymore
            updateSet.exit()
                .remove();

            // Create new path elements for each new data point
            updateSet.enter()
                .append("path")
                .attr("d", lineFunction)
                .attr("fill", "none")
                .attr("stroke", colour[ii])
                .attr("height", height).attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("class", "path " + "pathid" + ii)
                .attr("clip-path", "url(#clip)");
        }
    }

    render() {
        return <svg ref={node => this.node = node}
                    width={500} height={500}>
        </svg>
    }
}


export default LineChart