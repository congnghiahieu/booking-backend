const CommentModel = require('../../model/Comment');
const UserModel = require('../../model/User');
const HotelModel = require('../../model/Hotel');
const checkValidMongoId = require('../../utils/checkValidMongoId');
const findDoc = require('../../utils/findDoc');

/*
  POST /v1/cmts
*/

const createComment = async (req, res) => {
    const { userId, hotelId, title, content } = req.body;

    // Check for data fullfil
    if (!userId || !hotelId || !title || !content) {
        return res.status(400).json({
            message:
                'Bad request. Need full information includes: user id, hotel id, title, content',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(userId, hotelId);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        // Check user, hotel exist
        await Promise.all([
            findDoc('user', { _id: userId }, UserModel)(),
            findDoc('hotel', { _id: hotelId }, HotelModel)(),
        ]);

        // Create comment
        const newComment = await CommentModel.create({
            userId,
            hotelId,
            title,
            content,
        });

        console.log(newComment);

        return res.status(201).json({
            message: 'New comment created sucessfully',
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Create comment from user with ID ${userId} for hotel with ID ${hotelId} failed. ${err.message}`,
            isError: true,
        });
    }
};

module.exports = {
    createComment,
};
