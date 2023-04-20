const router = require('express').Router();
const serviceController = require('../../../controllers/services');
const fileUpload = require('express-fileupload');
const filesPayloadExists = require('../../../middlewares/filesPayloadExists');
const fileSizeLitmiter = require('../../../middlewares/fileSizeLimiter');
const fileExtLimiter = require('../../../middlewares/fileExtLimiter');
const verifyPagingParams = require('../../../middlewares/verifyPagingParams');

/*
  GET /v1/services
  GET /v1/services?id=
  GET /v1/services?hotel_id=
*/
router.get('/', verifyPagingParams, serviceController.getServices);
/*
  POST /v1/services
*/
router.post(
    '/',
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg']),
    fileSizeLitmiter,
    serviceController.createService,
);
/*
  PUT /v1/services/update_info
*/
router.put('/update_info', serviceController.updateServiceInfoById);
/*
  DELETE /v1/services?id=
  DELETE /v1/services?hotel_id=
*/
router.delete('/', serviceController.deleteServices);
/*
  /v1/hotels/images
*/
router.use('/images', require('./images'));

module.exports = router;
