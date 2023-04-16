const router = require('express').Router();
const userController = require('../../../controllers/users');

/*
  GET /v1/users
  GET /v1/users?user_id=
*/
router.get('/', userController.getUsers);
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
router.delete('/', userController.deletUserById);

module.exports = router;
