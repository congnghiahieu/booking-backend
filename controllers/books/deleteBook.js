const BookModel = require('../../model/Book');
const UserModel = require('../../model/User');
const HotelModel = require('../../model/Hotel');
const { checkValidMongoId } = require('../../utils/checkValidMongoId');

/*
  DELETE /v1/books?book_id
  DELETE /v1/books?user_id
  DELETE /v1/books?hotel_id

  Cùng 1 endpoint nhưng chỉ nhận 1 trong 3 params. Nếu nhận user_id thì không nhận hotel_id và book_id, tương tự ngược lại.
*/

const deleteBook = async (req, res) => {
    const { book_id: bookId, user_id: userId, hotel_id: hotelId } = req.query;

    // Check only accept one params
    let paramsCount = 0;
    let curFindField;
    let curModel = null;
    let curId = null;

    if (bookId) {
        paramsCount++;
        curId = bookId;
        curModel = BookModel;
        curFindField = {
            _id: bookId,
        };
    }

    if (userId) {
        paramsCount++;
        curId = userId;
        curModel = UserModel;
        curFindField = {
            userId: userId,
        };
    }

    if (hotelId) {
        paramsCount++;
        curId = hotelId;
        curModel = HotelModel;
        curFindField = {
            hotelId: hotelId,
        };
    }

    if (paramsCount != 1) {
        // Check fullfil information
        return res.status(400).json({
            message: 'Bad request. Need exactly one in in 3 params: user_id, hotel_id, book_id',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(curId);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        // Check if book / user / hotel exist
        const cur = await curModel.findById(curId).exec();

        if (!cur) {
            return res.status(400).json({
                message: `Bad request. Could not find ${
                    bookId
                        ? `book with ID ${bookId}`
                        : userId
                        ? `book of user with ID ${userId}`
                        : `book of hotel with ID ${hotelId}`
                }`,
            });
        }

        let result;
        // If find by book id
        if (bookId) {
            result = await cur.deleteOne();

            return res.status(200).json({
                message: `Book with ID ${result._id} of user with ID: ${result.userId} deleted succesfully`,
            });
        }

        // If find by user id or hotel id
        result = await BookModel.deleteMany(curFindField).lean().exec();

        // console.log(result);

        const resMsg = `Delete ${
            userId
                ? `${result.deletedCount} book of user with ID ${userId}`
                : `${result.deletedCount} book of hotel with ID ${hotelId}`
        } successfully`;

        return res.status(200).json({ message: resMsg, deleted: result.deletedCount });
    } catch (err) {
        // console.log(err);
        return res.status(422).json({
            message: `. Cannot find book with ${
                bookId ? '' : userId ? 'user' : 'hotel'
            } ID ${curId}`,
        });
    }
};

module.exports = {
    deleteBook,
};
