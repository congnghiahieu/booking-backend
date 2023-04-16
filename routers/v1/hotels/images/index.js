const router = require('express').Router();
const hotelImgController = require('../../../../controllers/hotels/images');

/*
  GET /v1/hotels/images/:id
*/
router.get('/:id', hotelImgController.getImagesByHotelId);
/*
  POST /v1/hotels/images/
*/
router.post('/', hotelImgController.addImagesByHotelId);
/*
  DELETE /v1/hotels/images
*/
router.delete('/', hotelImgController.deleteImagesByHotelId);

module.exports = router;
