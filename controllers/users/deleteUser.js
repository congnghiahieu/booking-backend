const UserModel = require('../../model/User');
const { checkValidMongoId } = require('../../utils/checkValidMongoId');

/*
  DELETE /v1/users
*/

const deleteUserById = async (req, res) => {
    const { id } = req.body;

    // Check for fullfil information
    if (!id) {
        return res.status(400).json({
            message: 'Bad request! Required user ID',
        });
    }

    // Check valid mongo ID
    const { isValid, errMsg, errCode } = checkValidMongoId(id);
    if (!isValid) return res.status(errCode).json(errMsg);

    try {
        // Check for exist hotel
        const user = await UserModel.findById(id).exec();

        if (!user) {
            return res.status(400).json({ message: 'Bad request. User not found' });
        }

        const result = await user.deleteOne();

        console.log(result);

        return res.status(200).json({
            message: `User name ${result.username} with ID ${result._id} deleted`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Delete user by id ${id} failed`,
            isError: true,
        });
    }
};

module.exports = {
    deleteUserById,
};
