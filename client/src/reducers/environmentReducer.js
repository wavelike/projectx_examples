import * as constants from './constantsActions'
import initialState from '../../resources/daily_result.json'

const environmentReducer = (state=initialState.environment, action) => {
    switch (action.type) {
        case constants.SET_INITIAL_STATE:
            return action.environment;
        default:
            return state
    }
};

export default environmentReducer
