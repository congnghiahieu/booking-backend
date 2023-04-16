const UserModel = require('../../model/User');
const rolesList = Object.values(require('../../config/rolesList'));
const bcrypt = require('bcrypt');

/*
    POST /v1/users
*/

const createUser = async (req, res) => {
    const {
        username,
        password,
        name = '',
        phone = '',
        email = '',
        nation = 'Việt Nam',
        others = '',
        roles,
    } = req.body;

    // Check for data fullfil
    if (!username || !password) {
        return res.status(400).json({
            message: 'Bad request. Required fields include: username, password',
        });
    }
    // Check if user already exists
    const duplicate = await UserModel.findOne({ username }).lean().exec();
    if (duplicate) {
        return res.status(409).json({
            message: `Account is already exists`,
        });
    }
    // If not duplicate
    try {
        const hashedPwd = await bcrypt.hash(password, 10);
        // Tạo user mới lưu vào database
        const newUser = await UserModel.create({
            username,
            password: hashedPwd,
            name,
            contact: {
                phone,
                email,
            },
            address: {
                nation,
                others,
            },
        });

        if (Array.isArray(roles) && roles.length && roles.every(role => rolesList.includes(role))) {
            newUser.roles = roles;
        }

        const result = await newUser.save();

        console.log(result);

        res.status(201).json({
            message: `User ${username} created successfully!`,
        });
    } catch (err) {
        console.log(err);
        return res.status(422).json({
            message: `Create new user failed`,
            isError: true,
        });
    }
};

module.exports = {
    createUser,
};
