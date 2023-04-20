const QUERY = require('../config/queryConst');

const verifyPagingParams = (req, res, next) => {
    if (!req.query.page) req.query.page = QUERY.DEFAULT_PAGE;
    if (!req.query.per_page) req.query.per_page = QUERY.DEFAULT_PER_PAGE;

    if (
        ![req.query.page, req.query.per_page]
            .map(v => Number.parseInt(v))
            .every(Number.isInteger) ||
        req.query.page < 1 ||
        req.query.per_page < 1 ||
        req.query.per_page > QUERY.LIMIT_PER_PAGE
    ) {
        return res.status(400).json({
            message: `Bad request. Invalid page or per_page params`,
        });
    }

    next();
};

module.exports = verifyPagingParams;
