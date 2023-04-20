const { getBooks } = require('./getBook');
const { createBook } = require('./createBook');
const { updateBookInfoById } = require('./updateBook');
const { deleteBook } = require('./deleteBook');

module.exports = {
    getBooks,
    createBook,
    updateBookInfoById,
    deleteBook,
};
