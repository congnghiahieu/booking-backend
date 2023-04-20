const router = require('express').Router();
const serviceImgController = require('../../../../controllers/services/images');
const fileUpload = require('express-fileupload');
const filesPayloadExists = require('../../../../middlewares/filesPayloadExists');
const fileSizeLitmiter = require('../../../../middlewares/fileSizeLimiter');
const fileExtLimiter = require('../../../../middlewares/fileExtLimiter');

/*
  GET /v1/services/images/:id
*/
router.get('/:id', serviceImgController.getImagesByServiceId);
/*
  POST /v1/services/images/:id
*/
router.post(
    '/:id',
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg']),
    fileSizeLitmiter,
    serviceImgController.addImagesByServiceId,
);
/*
  DELETE /v1/services/images/:id?image_name=...
  DELETE /v1/services/images/:id?image_name=all
*/
router.delete('/:id', serviceImgController.deleteImagesByServiceId);

module.exports = router;
