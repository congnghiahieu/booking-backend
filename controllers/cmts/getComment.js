const UserModel = require('../../model/User');
const HotelModel = require('../../model/Hotel');
const CommentModel = require('../../model/Comment');
const checkValidMongoId = require('../../utils/checkValidMongoId');
const pagingFind = require('../../utils/pagingFind');

/*
  GET /v1/cmts?user_id
  GET /v1/cmts?hotel_id

  Cùng 1 endpoint nhưng chỉ nhận 1 trong 2 params. Nếu nhận user_id thì không nhận hotel_id và ngược lại.
*/

const getComments = async (req, res) => {
    const { user_id: userId, hotel_id: hotelId, page, per_page } = req.query;

    // Check only accept one params
    let paramsCount = 0;
    let curModel;
    let curId;
    let curFindField;

    if (userId) {
        paramsCount++;
        curModel = UserModel;
        curId = userId;
        curFindField = {
            userId: userId,
        };
    }

    if (hotelId) {
        paramsCount++;
        curModel = HotelModel;
        curId = hotelId;
        curFindField = {
            hotelId: hotelId,
        };
    }

    if (paramsCount != 1) {
        // Check fullfil information
        return res.status(400).json({
            message: 'Bad request. Need exactly one in in 2 params: user_id, hotel_id',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(curId);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        // Check user / hotel exist
        const cur = await curModel.findById(curId).lean().exec();

        if (!cur) {
            return res.status(400).json({
                message: `Bad request. Cannot find ${userId ? 'user' : 'hotel'} with ID ${curId}`,
            });
        }

        // const cmtList = await CommentModel.find(curFindField).lean().exec();
        const cmtList = await pagingFind(page, per_page, CommentModel, curFindField);

        // console.log(cmtList);
        return res.status(200).json(cmtList);
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `. Cannot find ${userId ? 'user' : 'hotel'} with ID ${curId}`,
        });
    }
};

module.exports = {
    getComments,
};
