import * as constants from '../reducers/constantsActions'

export function addPortfolioOverview(newPortfolioOverview) {
    return {
        type: constants.ADD_PORTFOLIO_OVERVIEW,
        newPortfolioOverview: newPortfolioOverview
    }
}

export function removePortfolioOverview(portfolioOverviewId) {
    return {
        type: constants.REMOVE_PORTFOLIO_OVERVIEW,
        portfolioOverviewId: portfolioOverviewId
    }
}

export function addStock(portfolioOverviewId, symbol) {
    return {
        type: constants.ADD_STOCK_TO_PORTFOLIO_OVERVIEW,
        symbol: symbol,
        portfolioOverviewId: portfolioOverviewId
    }
}

export function removeStock(portfolioOverviewId, removeId) {
    return {
        type: constants.REMOVE_STOCK_FROM_PORTFOLIO_OVERVIEW,
        removeId: removeId,
        portfolioOverviewId: portfolioOverviewId
    }
}

export function changeStock(portfolioOverviewId, stockId, symbol) {
    return {
        type: constants.CHANGE_STOCK_IN_PORTFOLIO_OVERVIEW,
        symbol: symbol,
        portfolioOverviewId: portfolioOverviewId,
        stockId: stockId
    }
}

export function queryStocksBySubstring(query) {
    return {
        type: constants.QUERY_STOCKS_BY_SUBSTRING,
        query: query
    }
}