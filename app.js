require('express-async-errors');
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/connectDB');
const credentials = require('./middlewares/credentials');
const { logger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

// Conntect MongoDB
connectDB();

// Middlewares
/*
  Logger lưu request logs
*/
app.use(logger);
/*
  Handle options credentials check - Before CORS
  Check for Access-Control-Allow-Credentials and fetch cookies credentials requirements
*/
app.use(credentials);
/*
  Cors
  Chú ý: Với package cors thì sẽ có preflight cors (với method OPTIONS cụ thể xem log)
*/
app.use(cors(corsOptions));
/*
  Khi form data được submit lên server thì nó sẽ được encoded
  Midleware này có tác dụng decode form data và lưu trong req.body
  Khi form được request thì lên server thì Content-type: application/x-www-form-urlencoded
*/
app.use(express.urlencoded({ extended: false }));
/*
  Đọc được dữ liệu dạng json truyền lên server
*/
app.use(express.json());
/*
  Đọc được cookies được gửi từ clients
*/
app.use(cookieParser());
/*
  Cho phép các file tĩnh luôn được server phát hiện ra
  Các file tĩnh trong thư mục public: các file ảnh sẽ được request tải từ client, ...
*/
app.use('/', express.static(path.join(__dirname, 'public')));

// Routers
app.use(require('./routers'));

// Middlewares
/*
  Error handler đứng cuối để các lỗi được vứt ra ở phía trên sẽ được handler xử lý cuối cùng
*/
app.use(errorHandler);

// Export
/*
  Export to use in server.js
*/
module.exports = app;
