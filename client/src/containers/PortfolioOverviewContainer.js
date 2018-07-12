import React, {Component} from 'react'
import {connect} from "react-redux";
import PropTypes from "prop-types";

import {addStock, removeStock, changeStock} from "../actions/portfolioOverviewActions";
import StockElementContainer from "./StockElementContainer";
import ChartSwitcherElement from "./../components/ChartSwitcherElement";
import ChartContainer from "./ChartContainer";

import "../../css/portfolioOverview.css"
import 'bootstrap/dist/css/bootstrap.css';


const mapStateToProps = (state, ownProps) => ({
    id: ownProps.data.id,
    data: ownProps.data,
    addPortfolioOverview: ownProps.addPortfolioOverview,
    assetUniverse: state.assetUniverse,
    environment: state.environment
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    removeStock: (portfolioOverviewId, removeId) => {
        dispatch(removeStock(portfolioOverviewId, removeId))
            .then(() => console.log("removing a stock"))
    },
    addStock: (portfolioOverviewId, symbol) => {
        dispatch(addStock(portfolioOverviewId, symbol))
            .then(() => console.log("adding a new stock"))
    },
    changeStock: (portfolioOverviewId, stockId, symbol) => {
        dispatch(changeStock(portfolioOverviewId, stockId, symbol))
            .then(() => console.log("changing an existing stock to another"))
    }
});

export class PortfolioOverviewContainer extends Component {
    // PortfolioOverviewContainer provides functionality for one portfolio overview component, e.g. adding, removing
    //    or changing stocks and choosing between the chart modes (history, EMA, MACD, RSI)
    static propTypes = {
        id: PropTypes.number.isRequired,
        data: PropTypes.object.isRequired,
        addPortfolioOverview: PropTypes.func.isRequired,
        assetUniverse: PropTypes.arrayOf(PropTypes.object).isRequired,
        environment: PropTypes.object.isRequired
    };

    constructor(props){
        super(props);
        this.state = {activePeriod: "LastMonth", activeChart: "history"};
        this.stockChanged = this.stockChanged.bind(this);
        this.activateChart = this.activateChart.bind(this);
        this.addPortfolioOverview = this.addPortfolioOverview.bind(this);
        this.removePortfolioOverview = this.removePortfolioOverview.bind(this);
        this.getChartDataByChartType = this.getChartDataByChartType.bind(this);
    }

    stockChanged(stockId, newSymbol) {
        // If this stock element was set before
        if (this.props.data.stocks.length > stockId) {
            // If this stock shall be changed to a new symbol
            if (this.props.data.stocks[stockId] !== {} && newSymbol !== "") {
                this.props.changeStock(this.props.id, stockId, newSymbol);
            }
            // If this stock element shall be removed
            else if (this.props.data.stocks[stockId] !== {} && newSymbol === "") {
                this.props.removeStock(this.props.id, stockId)
            }
        }
        // If this stock element was not set before but now shall be
        else if (newSymbol !== "") {
            this.props.addStock(this.props.id, newSymbol)
        }
    }

    activateChart(chartType) {
        this.setState({activeChart: chartType})
    }

    addPortfolioOverview() {
        this.props.addPortfolioOverview();
    }

    removePortfolioOverview() {
        this.props.removePortfolioOverview(this.props.id);
    }

    getChartDataByChartType() {
        // filter the full stock dataset (this.props.data.stocks) according to currently activated Chart type and
        //  according to selected stock symbols and map to the time series data
        let chartData = null;

        // Filter the full assetUniverse for those stocks that are port of the portfolio
        let portfolioStocks = this.props.assetUniverse
            .filter(asset =>
                this.props.data.stocks
                    .map(stock => stock.symbol)
                    .includes(asset.symbol)
            );

        if (this.state.activeChart === "history") {
            if (this.props.data.stocks.length > 0)
                chartData = portfolioStocks.map(asset => asset.history);
        }
        else if (this.state.activeChart === "EMA") {
            if (this.props.data.stocks.length > 0)
                chartData = portfolioStocks.map(asset => asset.ema);
        }
        else if (this.state.activeChart === "MACD") {
            if (this.props.data.stocks.length > 0)
                chartData = portfolioStocks.map(asset => asset.macd);
        }
        else if (this.state.activeChart === "RSI") {
            if (this.props.data.stocks.length > 0)
                chartData = portfolioStocks.map(asset => asset.rsi);
        }

        let chartProperties = this.props.environment;

        return [chartData, chartProperties]
    }

    render() {
        let stockElements = this.props.data.stocks.map((stock, id) =>
                    <div key={id} className="col-lg-3 col-md-3 col-sm-4 col-xs-6">
                        <StockElementContainer key={id} id={id} data={stock}
                                               existingStocks={this.props.data.stocks.map(stock => stock.symbol)}
                                               stockChanged={this.stockChanged}/>
                    </div>
        );

        let chartDataReturn = this.getChartDataByChartType();
        let chartData = chartDataReturn[0];
        let chartProperties = chartDataReturn[1];

        return (
            <div>
                <div style={{border: "1px solid", height: "600px", padding: "20px", boxShadow: "0 0 10px black"}}>
                    <div className="side-by-side">
                        <ChartSwitcherElement key={0} type="history" activateChart={this.activateChart}/>
                        <ChartSwitcherElement key={1} type="EMA" activateChart={this.activateChart}/>
                        <ChartSwitcherElement key={2} type="MACD" activateChart={this.activateChart}/>
                        <ChartSwitcherElement key={3} type="RSI" activateChart={this.activateChart}/>
                        <button className="btn btn-danger" onClick={this.removePortfolioOverview}>X</button>
                    </div>

                    <div className="row" >
                        <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div style={{marginLeft: "0px"}}>
                                <ChartContainer chartData={chartData} chartProperties={chartProperties}/>
                            </div>
                        </div>
                    </div>

                    <div style={{height: "10px"}}> </div>

                    <div className="row">
                        {stockElements}
                    </div>
                </div>
                <div style={{height: "50px"}}> </div>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PortfolioOverviewContainer);