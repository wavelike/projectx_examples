import * as constants from './constantsActions'
import initialState from '../../resources/daily_result.json'


const assetUniverseReducer = (state=initialState.assetUniverse, action) => {
    switch (action.type) {
        case constants.SET_INITIAL_STATE:
            return action.assetUniverse;
        default:
            return state
    }
};

export default assetUniverseReducer
