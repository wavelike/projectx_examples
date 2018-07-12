import * as const"date": "18-Jun-14"}, {"close": 15.9475, "date": "19-Jun-14"}, {"close": 15.765, "date": "20-Jun-14"}, {"close": 15.69, "date": "23-Jun-14"}, {"close"ants from './constantsActions'
import initialState from '../../resources/daily_result.json'

const categoryReducer = (state=initialState.categories, action) => {
    switch (action.type) {
        case constants.SET_INITIAL_STATE:
            return action.categories;
        default:
            return state

    }
};

export default categoryReducer
