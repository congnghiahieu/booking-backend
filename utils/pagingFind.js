const pagingResult = require('./pagingResult');

const pagingFind = async (page, per_page, model, findField = {}, selectField = '') => {
    const resolved = await Promise.all([
        model.count(findField),
        model
            .find(findField)
            .sort({ updatedAt: -1 })
            .select(selectField)
            .skip((page - 1) * per_page)
            .limit(per_page)
            .lean()
            .exec(),
    ]);

    return pagingResult(page, per_page, resolved[0], resolved[1]);
};

module.exports = pagingFind;
