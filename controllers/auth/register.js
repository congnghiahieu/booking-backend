const bcrypt = require('bcrypt');
const UserModel = require('../../model/User');

/*
  POST /v1/auth/register
*/
const registerNewUser = async (req, res) => {
    // Check if lack of info
    const { username: newUserName, password: pwd, name, email } = req?.body;
    if (!newUserName || !pwd || !name || !email) {
        return res.status(400).json({
            message: `Bad request. Username, password, name, email are required`,
        });
    }
    // Check if user already exists (case insensitive)
    const duplicate = await UserModel.findOne({ username: new RegExp(newUserName, 'i') })
        .lean()
        .exec();
    if (duplicate) {
        return res.status(409).json({
            message: `Account is already exists`,
        });
    }
    // If not create a new user
    try {
        // Trong User Schema thuộc tính roles: {User: 1000} đã được đặt default nên không cần thêm ở bước tạo newUser nữa
        const hashedPwd = await bcrypt.hash(pwd, 10);
        // Tạo user mới lưu vào database
        const newUser = await UserModel.create({
            username: newUserName,
            name,
            password: hashedPwd,
            contact: {
                email: email,
            },
        });
        return res.status(201).json({
            message: `User ${newUserName} created successfully!`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `. Failed to create new user! Error: ${err.message}`,
        });
    }
};

module.exports = registerNewUser;
