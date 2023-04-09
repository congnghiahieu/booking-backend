const { saveLog } = require('./logger');

const errorHandler = (err, req, res, next) => {
  saveLog(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    'err-logs.txt',
  );
  console.log(err.stack);
  res.status(500).json({ message: err.message, isError: true });
};

module.exports = errorHandler;
