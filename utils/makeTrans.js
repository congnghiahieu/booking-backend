const TransactionModel = require('../model/Transaction');
const UserModel = require('../model/User');
const { TRANS_STATUS, TRANS_TYPES } = require('../config/transConst');
const checkValidMongoId = require('./checkValidMongoId');
const createErr = require('./createErr');

const makeTrans = async (
    userId,
    card,
    value,
    transType = TRANS_TYPES.BOOKING,
    status = TRANS_STATUS.SUCCESS,
) => {
    // Check for data fullfil
    const { cardName, cardSeries, cardExpiredate, cardCvc } = card;

    if (!userId || !cardName || !cardSeries || !cardExpiredate || !cardCvc || !value) {
        return createErr(
            400,
            'Bad request. Need full information includes: user id, cardName, cardSeries, cardExpiredate,cardCvc, value',
        );
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(userId);
    if (!isValid) {
        return createErr(errCode, errMsg);
    }

    try {
        // Check user exist
        const user = await UserModel.findById(userId).lean().exec();
        if (!user) {
            return createErr(400, `Bad request. User with ID ${userId} not found`);
        }

        // Create trans
        const newTrans = await TransactionModel.create({
            userId,
            card: {
                cardName,
                cardSeries,
                cardExpiredate: new Date(cardExpiredate),
                cardCvc,
            },
            value,
            transType: transType || TRANS_TYPES.BOOKING,
            status: status || TRANS_STATUS.SUCCESS,
        });

        console.log(newTrans);

        return {
            isError: false,
            transaction: newTrans,
        };
    } catch (catchedErr) {
        console.log(catchedErr);
        return createErr(422, `User with ID ${userId} create transaction failed`);
    }
};

module.exports = makeTrans;
