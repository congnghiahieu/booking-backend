const CommentModel = require('../../model/Comment');
const UserModel = require('../../model/User');
const HotelModel = require('../../model/Hotel');
const checkValidMongoId = require('../../utils/checkValidMongoId');

/*
  DELETE /v1/cmts?cmt_id
  DELETE /v1/cmts?user_id
  DELETE /v1/cmts?hotel_id

  Cùng 1 endpoint nhưng chỉ nhận 1 trong 3 params. Nếu nhận user_id thì không nhận hotel_id và cmt_id, tương tự ngược lại.
*/

const deleteComment = async (req, res) => {
    const { cmt_id: cmtId, user_id: userId, hotel_id: hotelId } = req.query;

    // Check only accept one params
    let paramsCount = 0;
    let curFindField;
    let curModel = null;
    let curId = null;

    if (cmtId) {
        paramsCount++;
        curId = cmtId;
        curModel = CommentModel;
        curFindField = {
            _id: cmtId,
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
            message: 'Bad request. Need exactly one in in 3 params: user_id, hotel_id, cmt_id',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(curId);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        // Check if cmt / user / hotel exist
        const cur = await curModel.findById(curId).exec();

        if (!cur) {
            return res.status(400).json({
                message: `Bad request. Could not find ${
                    cmtId
                        ? `comment with ID ${cmtId}`
                        : userId
                        ? `comment of user with ID ${userId}`
                        : `comment of hotel with ID ${hotelId}`
                }`,
            });
        }

        let result;
        // If find by cmt id
        if (cmtId) {
            result = await cur.deleteOne();

            return res.status(200).json({
                message: `Comment with ID ${result._id} and title: ${result.title} deleted succesfully`,
            });
        }

        // If find by user id or hotel id
        result = await CommentModel.deleteMany(curFindField).lean().exec();

        console.log(result);

        const resMsg = `Delete ${
            userId
                ? `${result.deletedCount} cmt of user with ID ${userId}`
                : `${result.deletedCount} cmt of hotel with ID ${hotelId}`
        } successfully`;

        res.status(200).json({ message: resMsg, deleted: result.deletedCount });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `. Cannot find comment with ${
                cmtId ? '' : userId ? 'user' : 'hotel'
            } ID ${curId}`,
        });
    }
};

module.exports = {
    deleteComment,
};
