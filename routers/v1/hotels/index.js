const router = require('express').Router();
const hotelController = require('../../../controllers/hotels');
const fileUpload = require('express-fileupload');
const filesPayloadExists = require('../../../middlewares/filesPayloadExists');
const fileSizeLitmiter = require('../../../middlewares/fileSizeLimiter');
const fileExtLimiter = require('../../../middlewares/fileExtLimiter');
const verifyPagingParams = require('../../../middlewares/verifyPagingParams');

/*
  GET /v1/hotels?hotel_id
*/
router.get('/', verifyPagingParams, hotelController.getHotels);
/*
  POST /v1/hotel
*/
router.post(
    '/',
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg']),
    fileSizeLitmiter,
    hotelController.createHotel,
);
/*
  PUT /v1/hotel/update_info
*/
router.put('/update_info', hotelController.updateHotelInfoById);
/*
  DELETE /v1/hotel
*/
router.delete('/', hotelController.deleteHotelById);
/*
  /v1/hotels/images
*/
router.use('/images', require('./images'));

module.exports = router;
