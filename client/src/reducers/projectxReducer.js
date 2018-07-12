import { combineReducers } from 'redux'
import categoryReducer from './categoryReducer'
import portfolioReducer from './portfolioReducer'
import stockReducer from './stockReducer'
import chartReducer from "./chartReducer"
import portfolioOverviewReducer from "./portfolioOverviewReducer"
import assetUniverseReducer from "./assetUniverseReducer"
import environmentReducer from "./environmentReducer"

const projectxReducer = combineReducers({
    categories: categoryReducer,
    portfolios: portfolioReducer,
    stocks: stockReducer,
    charts: chartReducer,
    portfolioOverviews: portfolioOverviewReducer,
    assetUniverse: assetUniverseReducer,
    environment: environmentReducer
});

export default projectxReducer
