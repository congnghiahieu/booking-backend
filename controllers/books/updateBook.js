const BookModel = require('../../model/Book');
const checkValidMongoId = require('../../utils/checkValidMongoId');
const { BOOK_STATUS } = require('../../config/bookConst');

/*
    PUT /v1/books/update_info
*/

const updateBookInfoById = async (req, res) => {
    const { id, flag } = req.body;

    // Check for data fullfil
    if (!id) {
        return res.status(400).json({
            message: 'Bad request. Required book ID',
        });
    }

    // Check valid flag type
    if (!Object.values(BOOK_STATUS).includes(flag)) {
        return res.status(400).json({ message: 'Bad request. Invalid flag type' });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(id);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        // Check for exist hotel
        const book = await BookModel.findById(id).exec();

        if (!book) {
            return res.status(400).json({ message: 'Bad request. Book not found' });
        }

        book.status = flag;
        if (flag === BOOK_STATUS.CANCELED) {
            book.isCanceled = true;
            book.canceledTime = Date.now();
        }

        const result = await book.save();

        console.log(result);

        return res.status(201).json({
            message: `Book ID ${book.id} updated sucessfully`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Update book with ID ${id} failed`,
            isError: true,
        });
    }
};

module.exports = {
    updateBookInfoById,
};
