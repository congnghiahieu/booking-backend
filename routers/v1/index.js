const router = require('express').Router();

/*
  http://localhost:8000/v1/auth/...
*/
router.use('/auth', require('./auth'));

module.exports = router;
