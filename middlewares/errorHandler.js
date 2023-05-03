const { saveLog } = require('./logger');

const errorHandler = (err, req, res, next) => {
    saveLog(
        `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
        'err-logs.txt',
    );
    console.log('Error handler:::');
    console.log(err.stack);
    const serverErrorStatusCode = 500;
    return res.status(serverErrorStatusCode).json({ message: err.message, isError: true });
};

module.exports = errorHandler;
