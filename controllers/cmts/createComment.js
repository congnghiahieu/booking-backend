const CommentModel = require('../../model/Comment');
const UserModel = require('../../model/User');
const HotelModel = require('../../model/Hotel');
const checkValidMongoId = require('../../utils/checkValidMongoId');
const findDoc = require('../../utils/findDoc');

/*
  POST /v1/cmts
*/

const createComment = async (req, res) => {
    const { userId, hotelId, title, content, point } = req.body;

    // Check for data fullfil
    if (!userId || !hotelId || !title || !content || !point || point < 0 || point > 10) {
        return res.status(400).json({
            message:
                'Bad request. Need full information includes: user id, hotel id, title, content, point (0 - 10)',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(userId, hotelId);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        // Check user, hotel exist
        const [user, hotel] = await Promise.all([
            findDoc('user', userId, UserModel, true)(),
            findDoc('hotel', hotelId, HotelModel)(),
        ]);

        // Create comment
        const newComment = await CommentModel.create({
            userId,
            user: {
                name: user.name,
                nation: user.address?.nation || '',
            },
            hotelId,
            title,
            content,
            point,
        });

        hotel.cmtSum += 1;
        await Promise.all([newComment.save(), hotel.save()]);

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
