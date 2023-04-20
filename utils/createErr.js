const createErr = (code, msg, payload) => {
    return {
        isError: true,
        errCode: code,
        errMsg: msg,
        payload: payload,
    };
};

module.exports = createErr;
