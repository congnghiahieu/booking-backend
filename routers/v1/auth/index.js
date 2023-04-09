const router = require('express').Router();
const loginController = require('../../../controllers/auth/login.controller');
const logoutController = require('../../../controllers/auth/logout.controller');
const refreshController = require('../../../controllers/auth/refresh.cotroller');
const registerController = require('../../../controllers/auth/register.controller');

/*
  POST http://localhost:8000/v1/auth/login
*/
router.post('/login', loginController);
/*
  GET http://localhost:8000/v1/auth/logout
*/
router.get('/logout', logoutController);
/*
  GET http://localhost:8000/v1/auth/refresh
*/
router.get('/refresh', refreshController);
/*
  POST http://localhost:8000/v1/auth/register
*/
router.post('/register', registerController);

module.exports = router;
