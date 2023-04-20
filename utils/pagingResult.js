const pagingResult = (page, per_page, total, data) => {
    const total_page = Math.ceil(total / per_page);

    return {
        meta: {
            page,
            per_page,
        },
        total,
        total_page,
        cur_total: data.length,
        data,
    };
};

module.exports = pagingResult;
