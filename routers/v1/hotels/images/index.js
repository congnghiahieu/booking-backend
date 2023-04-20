const router = require('express').Router();
const hotelImgController = require('../../../../controllers/hotels/images');
const fileUpload = require('express-fileupload');
const filesPayloadExists = require('../../../../middlewares/filesPayloadExists');
const fileSizeLitmiter = require('../../../../middlewares/fileSizeLimiter');
const fileExtLimiter = require('../../../../middlewares/fileExtLimiter');

/*
  GET /v1/hotels/images/:id
*/
router.get('/:id', hotelImgController.getImagesByHotelId);
/*
  POST /v1/hotels/images/:id
*/
router.post(
    '/:id',
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg']),
    fileSizeLitmiter,
    hotelImgController.addImagesByHotelId,
);
/*
  DELETE /v1/hotels/images/:id?image_name=...
  DELETE /v1/hotels/images/:id?image_name=all
*/
router.delete('/:id', hotelImgController.deleteImagesByHotelId);

module.exports = router;
