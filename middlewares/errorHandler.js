const { saveLog } = require("./logger");

const errorHandler = (err, req, res, next) => {
  saveLog(`${err.name} : ${err.message}`, "err-logs.txt");
  console.log(err.stack);
  res.status(500).send(err.message);
};

module.exports = errorHandler;
