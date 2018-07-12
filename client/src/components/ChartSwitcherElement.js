import React, {Component} from 'react'
import {connect} from "react-redux";
import PropTypes from "prop-types";


const mapStateToProps = (state, ownProps) => ({
    type: ownProps.type,
    activateChart: ownProps.activateChart
});

const mapDispatchToProps = (dispatch, ownProps) => ({

});

export class ChartSwitcherElement extends Component {
    // ChartSwitcherElement provides a button which can be used to change the type of Chart displayed
    static propTypes = {
        type: PropTypes.string.isRequired,
        activateChart: PropTypes.func.isRequired
    };

    constructor(props){
        super(props);
        this.activateChart = this.activateChart.bind(this);
    }

    activateChart() {
        this.props.activateChart(this.props.type)
    }

    render() {
        return (
            <div>
                <button className="btn btn-info" style={{color: "black", border: "1px solid"}} onClick={this.activateChart}>{this.props.type}</button>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ChartSwitcherElement);