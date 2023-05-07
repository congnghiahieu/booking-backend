const router = require('express').Router();
const favController = require('../../../../controllers/users/fav');

/*
    GET /v1/users/fav?user_id=
*/
router.get('/', favController.getFav);
/*
    POST /v1/users/fav
*/
router.post('/', favController.addFav);
/*
    DELETE /v1/users/fav
*/
router.delete('/', favController.deleteFav);

module.exports = router;
