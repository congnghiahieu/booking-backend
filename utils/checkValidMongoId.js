const mongoose = require('mongoose');

const checkValidMongoId = (...ids) => {
    let isValid = true;
    let errMsg = '';
    let errCode = 200;
    const invalidArr = [];

    ids.forEach(id => {
        if (!mongoose.isValidObjectId(id)) invalidArr.push(id);
    });

    // If there is invalid id
    if (invalidArr.length) {
        isValid = false;
        errCode = 400;
        errMsg = {
            message: `Bad request. Invalid ID: ${invalidArr.join(', ')}`,
        };
    }

    return { isValid, errMsg, errCode };
};

module.exports = checkValidMongoId;
