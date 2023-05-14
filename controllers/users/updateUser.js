const UserModel = require('../../model/User');
const rolesList = Object.values(require('../../config/rolesList'));
const { checkValidMongoId } = require('../../utils/checkValidMongoId');

/*
    PUT /v1/users/update_info
*/

const updateUserInfoById = async (req, res) => {
    const { id, name, phone, email, nation, others, roles } = req.body;

    // Check for data fullfil
    if (!id) {
        return res.status(400).json({
            message: 'Bad request. Required users ID',
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

        // Update new information
        if (name) user.name = name;
        if (nation) user.address.nation = nation;
        if (others) user.address.others = others;
        if (phone) user.contact.phone = phone;
        if (email) user.contact.email = email;
        if (Array.isArray(roles) && roles.length && roles.every(role => rolesList.includes(role))) {
            user.roles = roles;
        }

        const result = await user.save();

        console.log(result);

        return res.status(201).json({
            message: `User ID ${result._id} updated sucessfully`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `. Update user info with ID ${id} failed`,
            isError: true,
        });
    }
};

module.exports = {
    updateUserInfoById,
};
