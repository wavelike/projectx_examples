import * as constants from './constantsActions'
import initialState from '../../resources/daily_result.json'

const portfolioReducer = (state=initialState.portfolios, action) => {
    switch (action.type) {
        case constants.SET_INITIAL_STATE:
            return action.portfolios;
        default:
            return state
    }
};

export default portfolioReducer
