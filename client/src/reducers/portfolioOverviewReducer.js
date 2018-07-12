import * as constants from './constantsActions'
import initialState from '../../resources/daily_result.json'


const portfolioOverviewReducer = (state=initialState.portfolioOverviews, action) => {
    // TODO: Better not do deep copies here for performance reasons
    let newState = JSON.parse(JSON.stringify(state));  // Shallow copy for each level of state
    switch (action.type) {
        case constants.SET_INITIAL_STATE:
            return action.portfolioOverviews;
        case constants.ADD_PORTFOLIO_OVERVIEW: {
            newState.push(action.newPortfolioOverview); // Add a new portfolio Overview to state
            return newState
        }
        case constants.REMOVE_PORTFOLIO_OVERVIEW: {
            return newState.filter(overview => overview.id !== action.portfolioOverviewId); // remove portfolio
        }
        case constants.ADD_STOCK_TO_PORTFOLIO_OVERVIEW: {
            newState.filter(overview => overview.id === action.portfolioOverviewId)[0].stocks.push({symbol: action.symbol});
            return newState;
        }
        case constants.REMOVE_STOCK_FROM_PORTFOLIO_OVERVIEW: {
            newState.filter(overview => overview.id === action.portfolioOverviewId)[0].stocks.splice(action.removeId, 1);
            return newState;
        }
        case constants.CHANGE_STOCK_IN_PORTFOLIO_OVERVIEW: {
            newState.filter(overview => overview.id === action.portfolioOverviewId)[0].stocks[action.stockId].symbol = action.symbol;
            return newState;
        }
        default:
            return state
    }
};

export default portfolioOverviewReducer
