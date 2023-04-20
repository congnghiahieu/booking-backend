const router = require('express').Router();
const cmtController = require('../../../controllers/cmts');
const verifyPagingParams = require('../../../middlewares/verifyPagingParams');

/*
  GET /v1/cmts/?hotel_id=
  GET /v1/cmts/?user_id=
*/
router.get('/', verifyPagingParams, cmtController.getComments);
/*
  POST /v1/cmts
*/
router.post('/', cmtController.createComment);
/*
  PUT /v1/cmts/update_cmt
*/
router.put('/update_cmt', cmtController.updateCmtById);
/*
  DELETE /v1/cmts/?cmt_id=
  DELETE /v1/cmts/?user_id=
  DELETE /v1/cmts/?hotel_id=
*/
router.delete('/', cmtController.deleteComment);

module.exports = router;
