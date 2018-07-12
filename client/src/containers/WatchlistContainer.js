import React, {Component} from 'react'
import {connect} from "react-redux";
import PropTypes from "prop-types";

import PortfolioOverviewContainer from "./PortfolioOverviewContainer";
import {addPortfolioOverview, removePortfolioOverview} from "../actions/portfolioOverviewActions";

import 'bootstrap/dist/css/bootstrap.css';



const mapStateToProps = (state, ownProps) => ({
    portfolioOverviews: state.portfolioOverviews,
    assetUniverse: state.assetUniverse
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    addPortfolioOverview: (newPortfolioOverview) => {
        dispatch(addPortfolioOverview(newPortfolioOverview))
            .then(() => console.log("adding portfolio overview"))
    },
    removePortfolioOverview: (portfolioOverviewId) => {
        dispatch(removePortfolioOverview(portfolioOverviewId))
            .then(() => console.log("removing portfolio overview"))
    }
});

export class WatchlistContainer extends Component {
    // WatchListContainer provides functionality to add or remove portfolio overviews
    static propTypes = {
        portfolioOverviews: PropTypes.arrayOf(PropTypes.object).isRequired,
        assetUniverse: PropTypes.arrayOf(PropTypes.object).isRequired
    };

    constructor(props){
        super(props);
        this.addPortfolioOverview = this.addPortfolioOverview.bind(this);
        this.removePortfolioOverview = this.removePortfolioOverview.bind(this);
    }

    addPortfolioOverview() {
        let newPortfolioOverview = {
                id: new Date().getTime(),
                stocks: [this.props.portfolioOverviews[0].stocks[0]]
            };

        this.props.addPortfolioOverview(newPortfolioOverview)
    }

    removePortfolioOverview(portfolioOverviewId) {
        this.props.removePortfolioOverview(portfolioOverviewId)
    }

    render() {
        let portfolioOverviews = this.props.portfolioOverviews.map((overview, index) =>
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4" key={index}>
                <PortfolioOverviewContainer key={index} data={overview} addPortfolioOverview={this.addPortfolioOverview}
                                            removePortfolioOverview={this.removePortfolioOverview}/>
            </div>
        );

        return (
            <div className="container-fluid">
                <div className="row">
                    {portfolioOverviews}
                </div>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(WatchlistContainer);