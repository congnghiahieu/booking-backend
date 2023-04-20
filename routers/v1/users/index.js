const router = require('express').Router();
const userController = require('../../../controllers/users');
const verifyPagingParams = require('../../../middlewares/verifyPagingParams');

/*
  GET /v1/users
  GET /v1/users?user_id=
*/
router.get('/', verifyPagingParams, userController.getUsers);
/*
  POST /v1/users
*/
router.post('/', userController.createUser);
/*
  PUT /v1/users/update_info
*/
router.put('/update_info', userController.updateUserInfoById);
/*
  DELETE /v1/users
*/
router.delete('/', userController.deleteUserById);

module.exports = router;
