const router = require('express').Router();
const serviceImgController = require('../../../../controllers/services/images');

/*
  GET /v1/services/images/:id
*/
router.get('/:id', serviceImgController.getImagesByServiceId);
/*
  POST /v1/services/images/
*/
router.post('/', serviceImgController.addImagesByServiceId);
/*
  DELETE /v1/services/images
*/
router.delete('/', serviceImgController.deleteImagesByServiceId);

module.exports = router;
