const bcrypt = require('bcrypt');
const UserModel = require('../../model/User');

/*
  POST /v1/auth/reset
*/
const reset = async (req, res) => {
    // Check if lack of info
    const { userId, oldPassword: oldPwd, newPassword: newPwd } = req?.body;
    if (!userId || !oldPwd || !newPwd) {
        return res.status(400).json({
            message: `Bad request. User ID, old password and new password are required`,
        });
    }
    // Check if user already exists (case insensitive)
    const user = await UserModel.findById(userId).exec();
    if (!user) {
        return res.status(404).json({
            message: `User with ID ${userId} not found.`,
        });
    }

    try {
        const isRightPwd = await bcrypt.compare(oldPwd, user.password);
        if (!isRightPwd) {
            return res.status(401).json({ message: 'Unauthorized. Invalid password' });
        }
        const hashedPwd = await bcrypt.hash(newPwd, 10);
        user.password = hashedPwd;
        await user.save();

        return res.status(201).json({
            message: `User with ID ${userId} change password successfully!`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `. Failed to change password new user! Error: ${err.message}`,
        });
    }
};

module.exports = reset;
