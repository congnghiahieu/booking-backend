const bcrypt = require("bcrypt");
const userModel = require("../model/User");

const registerNewUser = async (req, res) => {
  // Check if lack of info
  const { username: newUserName, password: pwd } = req?.body;
  if (!newUserName || !pwd) {
    return res.status(400).json({
      message: `Bad request! Username and password are required`,
    });
  }
  // Check if user already exists
  const duplicate = await userModel.findOne({ username: newUserName }).exec();
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
    const newUser = await userModel.create({
      username: newUserName,
      password: hashedPwd,
    });
    console.log(newUser);
    res.status(201).json({
      message: `User ${newUserName} created successfully!`,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Failed to create new user! Error: ${err.message}`,
    });
  }
};

module.exports = { registerNewUser };
