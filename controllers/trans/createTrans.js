const TransactionModel = require('../../model/Transaction');
const UserModel = require('../../model/User');
const { TRANS_STATUS, TRANS_TYPES } = require('../../config/transConst');
const { checkValidMongoId } = require('../../utils/checkValidMongoId');

/*
  POST /v1/trans
*/

const createTrans = async (req, res) => {
    const { userId, cardSeries, value, transType, status } = req.body;

    // Check for data fullfil
    if (!userId || !cardSeries || !value) {
        return res.status(400).json({
            message: 'Bad request. Need full information includes: user id, card series, value',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(userId);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        // Check user exist
        const user = await UserModel.findById(userId).lean().exec();
        if (!user) {
            return res.status(400).json({
                message: `Bad request. User with ID ${userId} not found`,
            });
        }

        // Create hotel
        const newTrans = await TransactionModel.create({
            userId,
            cardSeries,
            value,
            transType: transType || TRANS_TYPES.BOOKING,
            status: status || TRANS_STATUS.SUCCESS,
        });

        // console.log(newTrans);

        return res.status(201).json({
            message: 'New transaction created sucessfully',
        });
    } catch (err) {
        // console.log(err);
        return res.status(422).json({
            message: `User with ID ${userId} create transaction failed`,
            isError: true,
        });
    }
};

module.exports = {
    createTrans,
};
