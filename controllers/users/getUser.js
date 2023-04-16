const UserModel = require('../../model/User');
const checkValidMongoId = require('../../utils/checkValidMongoId');

/*
  GET /v1/users
  GET /v1/users?user_id
*/

const getUsers = async (req, res) => {
    const { user_id: userId } = req.query;

    let findField = {};

    if (userId) {
        const { isValid, errMsg, errCode } = checkValidMongoId(userId);
        if (!isValid) return res.status(errCode).json(errMsg);

        findField = {
            _id: userId,
        };
    }

    try {
        const userList = await UserModel.find(findField).select('-password').lean().exec();

        if (userId && !userList?.length) {
            // If find single user and not found mean wrong id
            return res.status(400).json({
                message: `No user with ID ${userId} found`,
            });
        }

        // If find single user return single obj
        let result = userList;
        if (userId && userList.length == 1) {
            result = userList[0];
        }

        return res.status(200).json(result);
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Get ${userId ? `user with ID ${userId}` : 'all users'} failed`,
            isError: true,
        });
    }
};

module.exports = {
    getUsers,
};
