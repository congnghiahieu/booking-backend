const TransactionModel = require('../../model/Transaction');
const UserModel = require('../../model/User');
const checkValidMongoId = require('../../utils/checkValidMongoId');

/*
  GET /v1/trans
  GET /v1/trans?user_id
*/

const getTrans = async (req, res) => {
    const { user_id: userId } = req.query;

    let findField = {};

    // Check for hotel id (query single hotel)
    if (userId) {
        const { isValid, errMsg, errCode } = checkValidMongoId(userId);
        if (!isValid) return res.status(errCode).json(errMsg);

        findField = { userId: userId };
    }

    try {
        // If has user_id param
        if (userId) {
            // Check for exist user
            const user = await UserModel.findById(userId).lean().exec();

            if (!user) {
                return res
                    .status(400)
                    .json({ message: `Bad request. User with ID ${userId} not found` });
            }
        }

        const transList = await TransactionModel.find(findField).lean().exec();

        console.log(transList);

        return res.status(200).json(transList);
    } catch (err) {
        console.log(err);

        const errMsg = `Get all transactions ${!userId ? '' : `of user with ID ${userId}`} failed`;

        return res.status(422).json({
            message: errMsg,
            isError: true,
        });
    }
};

module.exports = {
    getTrans,
};
