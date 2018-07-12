import * as constants from './constantsActions'
import initialState from '../../resources/daily_result.json'


const chartReducer = (state=initialState.charts, action) => {
    switch (action.type) {
        case constants.SET_INITIAL_STATE:
            return action.charts;
        default:
            return state

    }

};

export default chartReducer
