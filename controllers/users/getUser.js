const UserModel = require('../../model/User');
const checkValidMongoId = require('../../utils/checkValidMongoId');
const pagingFind = require('../../utils/pagingFind');

/*
  GET /v1/users?page=&per_page=
  GET /v1/users?user_id
*/

const getUsers = async (req, res) => {
    const { user_id: userId, page, per_page } = req.query;

    if (userId) {
        const { isValid, errMsg, errCode } = checkValidMongoId(userId);
        if (!isValid) return res.status(errCode).json(errMsg);
    }

    try {
        if (userId) {
            const user = await UserModel.findById(userId).lean().exec();
            if (!user) {
                // If find single user and not found mean wrong id
                return res.status(400).json({
                    message: `No user with ID ${userId} found`,
                });
            }
            return res.status(200).json(user);
        }

        const userList = await pagingFind(page, per_page, UserModel);

        res.status(200).json(userList);
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
