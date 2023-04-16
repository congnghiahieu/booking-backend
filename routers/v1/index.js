const router = require('express').Router();

/*
  /v1/auth/...
*/
router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/hotels', require('./hotels'));
router.use('/services', require('./services'));
router.use('/books', require('./books'));
router.use('/trans', require('./trans'));
router.use('/cmts', require('./cmts'));

module.exports = router;
