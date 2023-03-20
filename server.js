require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const credentials = require('./middlewares/credentials');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/connectDB');

// Conntect MongoDB
connectDB();
// Middlewares
// Logger lưu req logs
app.use(logger);
// Handle options credentials check - Before CORS check for Access-Control-Allow-Credentials
// and fetch cookies credentials requirements
app.use(credentials);
// Cors (Chú ý với package cors thì sẽ có preflight cors (với method OPTIONS cụ thể xem log))
app.use(cors(corsOptions));
// Khi form data được submit lên server thì nó sẽ được encoded(), middleware này có tác dụng decode form data và lưu trong req.body (Khi form được request thì lên server thì Content-type: application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: false }));
// Đọc được dữ liệu dạng json truyền lên server
app.use(express.json());
// Đọc được cookies được gửi từ clients
app.use(cookieParser());
// Cho phép các file tĩnh luôn được server phát hiện ra
app.use('/', express.static(path.join(__dirname, 'public'))); // static file for '/' router
//---------------------------------------------------------------------------------------
// Routers
app.use('/', require('./routers/root'));
app.use('/register', require('./routers/register'));
app.use('/login', require('./routers/login'));
app.use('/logout', require('./routers/logout'));
// app.use('/refresh', require('./routers/refresh'));

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not found' });
  } else {
    res.type('txt').send('404 Not found');
  }
});
//--------------------------------------------------------------------------------------
// Middlewares
// Error handler đứng cuối để các lỗi được vứt ra ở phía trên sẽ được handler xử lý cuối cùng
app.use(errorHandler);
//--------------------------------------------------------------------------------------

mongoose.connection.once('open', () => {
  console.log('Connect to MongoDB successfully');
  app.listen(PORT, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`App is listening on ${PORT}`);
  });
});
