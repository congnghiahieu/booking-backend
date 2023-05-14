const router = require('express').Router();
const authController = require('../../../controllers/auth');

/*
  POST /v1/auth/register
*/
router.post('/register', authController.register);
/*
  POST /v1/auth/reset
*/
router.post('/reset', authController.reset);
/*
  POST /v1/auth/login
*/
router.post('/login', authController.login);
/*
  GET /v1/auth/logout
*/
router.get('/logout', authController.logout);
/*
  GET /v1/auth/refresh
*/
router.get('/refresh', authController.refresh);
/*
  /v1/auth/google
*/
router.use('/google', require('./google'));

module.exports = router;
