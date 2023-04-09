require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const { saveLog } = require('./middlewares/logger');
const PORT = process.env.PORT || 8000;

mongoose.connection.once('open', () => {
  console.log('Connect to MongoDB successfully');
  app.listen(PORT, err => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`App is listening on ${PORT}`);
  });
});

mongoose.connection.on('error', err => {
  console.log(err);
  saveLog(`${err.ok}: ${err.code}\t${err.codeName}\t`, 'mongoErrLog.log');
});
