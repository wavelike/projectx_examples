import React, {Component} from 'react'
import {connect} from "react-redux";
import PropTypes from "prop-types";

import "../../css/portfolioOverview.css"
import 'bootstrap/dist/css/bootstrap.css';


const mapStateToProps = (state, ownProps) => ({
    id: ownProps.id,
    existingStocks: ownProps.existingStocks,
    data: ownProps.data,
    assetUniverse: state.assetUniverse,
    stockChanged: ownProps.stockChanged
});

const mapDispatchToProps = (dispatch, ownProps) => ({

});

export class StockElementContainer extends Component {
    // StockElementContainer provides functionality to select or change the stock being displayed in the Chart
    static propTypes = {
        id: PropTypes.number.isRequired,
        existingStocks: PropTypes.arrayOf(PropTypes.string).isRequired,
        data: PropTypes.object.isRequired,
        assetUniverse: PropTypes.arrayOf(PropTypes.object).isRequired,
        stockChanged: PropTypes.func.isRequired
    };

    constructor(props){
        super(props);
        this.state = {stockSet: false};
        this.stockChanged = this.stockChanged.bind(this)
    }

    stockChanged(event) {
        if (this.props.existingStocks.includes(event.target.value) === false)
            this.props.stockChanged(this.props.id, event.target.value);
        else
            alert("Stock already exists in portfolio")
    }

    render() {
        let resultElement = null;
        if (this.state.stockSet === true) {
            resultElement = <button className="btn btn-info">{this.props.data.symbol}</button>
        }
        else {
            let selectOptions = [<option key={0} value={""}>{""}</option>];
            selectOptions = selectOptions.concat(this.props.assetUniverse.map((asset, id) =>
                                <option key={id+1} value={asset.symbol}>{asset.symbol}</option>
                                ));

            let classNameString = "form-control btn dropdown-toggle stock-element" + this.props.id;
            resultElement = (
                <div>
                    <select className={classNameString} style={{color: "black", border: "1px solid"}}
                            value={this.props.data.symbol} onChange={this.stockChanged}>
                        {selectOptions}
                    </select>
                </div>
            )
        }

        return (
            <div>
                {resultElement}
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(StockElementContainer);