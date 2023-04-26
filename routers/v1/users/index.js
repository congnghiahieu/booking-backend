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
  PUT /v1/users/update_fav
*/
router.put('/update_fav', userController.updateUserFavInfoById);
/*
  PUT /v1/users/update_cart
*/
router.put('/update_cart/', userController.updateUserCartInfoById);

/*
  DELETE /v1/users
*/
router.delete('/', userController.deleteUserById);
router.delete('/delete_cart', userController.deleteCart);
router.delete('/delete_fav', userController.deleteFav);

module.exports = router;
