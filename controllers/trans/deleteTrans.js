const TransactionModel = require('../../model/Transaction');
const UserModel = require('../../model/User');
const { checkValidMongoId } = require('../../utils/checkValidMongoId');

/*
  DELETE /v1/trans?id
  DELETE /v1/trans?user_id

  Delete all user transaction
*/

const deleteTrans = async (req, res) => {
    const { id, user_id: userId } = req.query;

    // Check only accept one params
    let paramsCount = 0;
    let curModel = null;
    let curId = null;

    if (id) {
        paramsCount++;
        curId = id;
        curModel = TransactionModel;
    }

    if (userId) {
        paramsCount++;
        curId = userId;
        curModel = UserModel;
    }

    if (paramsCount != 1) {
        // Check valid query params
        return res.status(400).json({
            message: 'Bad request. Need exactly one in 2 params: id, user_id',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(curId);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        // Check for exist transaction or user
        const cur = await curModel.findById(curId).exec();

        if (!cur) {
            return res.status(400).json({
                message: `Bad request. ${id ? 'Transaction' : 'User'} with ${curId} not found`,
            });
        }

        let result;

        // If delete one transaction
        if (id) {
            result = await cur.deleteOne();
            return res.status(200).json({
                message: `Transaction ${result._id} of user with ID ${result.userId} deleted successfully`,
            });
        }

        // If delete transactions by user id
        result = await TransactionModel.deleteMany({
            userId: userId,
        })
            .lean()
            .exec();

        console.log(result);

        return res.status(200).json({
            message: `${result.deletedCount} transactions of user ${cur.username} ${cur._id} deleted successfully`,
            deleted: result.deletedCount,
        });
    } catch (err) {
        console.log(err);

        const errMsg = `Delete ${
            userId ? `all transactions of user` : 'transaction'
        } with ID ${curId} failed`;

        return res.status(422).json({
            message: errMsg,
            isError: true,
        });
    }
};

module.exports = {
    deleteTrans,
};
