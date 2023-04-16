const router = require('express').Router();
const serviceController = require('../../../controllers/services');

/*
  GET /v1/services
  GET /v1/services?id=
  GET /v1/services?hotel_id=
*/
router.get('/', serviceController.getServices);
/*
  POST /v1/services
*/
router.post('/', serviceController.createService);
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
