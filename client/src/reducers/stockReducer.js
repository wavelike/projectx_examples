import * as constants from './constantsActions'
import initialState from '../../resources/daily_result.json'

const stockReducer = (state=initialState.stocks, action) => {
    switch (action.type) {
        case constants.SET_INITIAL_STATE:
            return action.stocks;
        default:
            return state
    }
};

export default stockReducer
