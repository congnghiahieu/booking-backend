const router = require('express').Router();
const hotelImgController = require('../../../../controllers/hotels/images');
const fileUpload = require('express-fileupload');
const filesPayloadExists = require('../../../../middlewares/filesPayloadExists');
const fileSizeLitmiter = require('../../../../middlewares/fileSizeLimiter');
const fileExtLimiter = require('../../../../middlewares/fileExtLimiter');

/*
  GET /v1/hotels/images?hotel_id=
*/
router.get('/', hotelImgController.getImagesByHotelId);
/*
  POST /v1/hotels/images
*/
router.post(
    '/',
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg']),
    fileSizeLitmiter,
    hotelImgController.addImagesByHotelId,
);
/*
  DELETE /v1/hotels/images
*/
router.delete('/', hotelImgController.deleteImagesByHotelId);

module.exports = router;
