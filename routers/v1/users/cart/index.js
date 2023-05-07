const router = require('express').Router();
const cartController = require('../../../../controllers/users/cart');

/*
    GET /v1/users/cart?user_id=
*/
router.get('/', cartController.getCart);
/*
    POST /v1/users/cart
*/
router.post('/', cartController.addCart);
/*
    DELETE /v1/users/cart
*/
router.delete('/', cartController.deleteCart);

module.exports = router;
