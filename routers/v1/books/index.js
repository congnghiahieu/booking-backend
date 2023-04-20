const router = require('express').Router();
const bookController = require('../../../controllers/books');
const verifyPagingParams = require('../../../middlewares/verifyPagingParams');

/*
  GET /v1/books?user_id=
  GET /v1/books?hotel_id=
*/
router.get('/', verifyPagingParams, bookController.getBooks);
/*
  POST /v1/books
*/
router.post('/', bookController.createBook);
/*
  PUT /v1/books/update_info
*/
router.put('/update_info', bookController.updateBookInfoById);
/*
  DELETE /v1/books?book_id=
  DELETE /v1/books?user_id=
  DELETE /v1/books?hotel_id=
*/
router.delete('/', bookController.deleteBook);

module.exports = router;
