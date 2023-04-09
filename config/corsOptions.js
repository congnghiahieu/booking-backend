const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
  origin: (origin, callback) => {
    /*
      orgin undefined tức là origin đến từ browser, browser là 1 client
    */
    if (allowedOrigins.indexOf(origin) !== -1 || origin === undefined) {
      callback(null, true);
    } else {
      callback(new Error('Now allowed by Cors'));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
