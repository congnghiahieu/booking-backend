const router = require('express').Router();
const bookController = require('../../../controllers/books');

/*
  GET /v1/books?user_id=
  GET /v1/books?hotel_id=
*/
router.get('/', bookController.getBooks);
/*
  POST /v1/books
*/
router.post('/', bookController.createBook);
/*
  DELETE /v1/books?book_id=
  DELETE /v1/books?user_id=
  DELETE /v1/books?hotel_id=
*/
router.delete('/', bookController.deleteBook);

module.exports = router;
