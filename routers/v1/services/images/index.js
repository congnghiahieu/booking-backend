const router = require('express').Router();
const serviceImgController = require('../../../../controllers/services/images');
const fileUpload = require('express-fileupload');
const filesPayloadExists = require('../../../../middlewares/filesPayloadExists');
const fileSizeLitmiter = require('../../../../middlewares/fileSizeLimiter');
const fileExtLimiter = require('../../../../middlewares/fileExtLimiter');

/*
  GET /v1/services/images?service_id=
*/
router.get('/', serviceImgController.getImagesByServiceId);
/*
  POST /v1/services/images
*/
router.post(
    '/',
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg']),
    fileSizeLitmiter,
    serviceImgController.addImagesByServiceId,
);
/*
  DELETE /v1/services/images
*/
router.delete('/', serviceImgController.deleteImagesByServiceId);

module.exports = router;
