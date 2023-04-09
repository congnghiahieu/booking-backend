const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../../model/User');

const login = async (req, res) => {
  // Check if lack of info
  const { username: userLoginName, password: pwd } = req?.body;
  if (!userLoginName || !pwd) {
    return res.status(400).json({
      message: `Bad request! Username and password are required`,
    });
  }
  // Check if user not exists
  const foundUser = await UserModel.findOne({ username: userLoginName }).exec();
  if (!foundUser) {
    return res.status(401).json({
      message: `User ${userLoginName} not exist`,
    });
  }
  // If exists check pwd
  try {
    const isRightPwd = await bcrypt.compare(pwd, foundUser.password);
    if (isRightPwd) {
      // Login thành công thì user được cấp 1 accessToken gửi về qua JSON, 1 refresh token gửi về qua httpOnly cookie
      // create access token
      const roles = Object.values(foundUser.roles).filter(Boolean);
      const newAccessToken = jwt.sign(
        {
          'UserInfo': {
            username: foundUser.username,
            roles,
          },
        },
        process.env.ACCESS_TOKEN_SERECT,
        {
          expiresIn: '30s',
        },
      );
      // create refresh token
      const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SERECT,
        {
          expiresIn: '1d',
        },
      );

      // Có thể xảy ra trường hợp user chưa logout nhưng đã có thể login (TH này phải xử lý ở phía client, nhưng ở server cũng phải đảm bảo xử lý TH này)
      const cookies = req?.cookies;
      console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
      let otherRetos = !cookies?.jwt
        ? foundUser.refreshToken
        : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);
      // Clear old cookies
      if (cookies?.jwt) {
        /*
        Scenario added:
        1) User logs in but never uses RT and does not log out -> RT stay in DB
        2) RT stolen and used by hackers
        3) If 1 & 2, reuse dectection is needed to clear all RTs when user logs in again
        */
        // Detected refresh token reuse
        const oldReTo = cookies.jwt;
        const user = await UserModel.findOne({ refreshToken: oldReTo }).exec();
        // Không tìm thấy user tương ứng với oldReto bởi vì ReTo đã được sử dụng bởi hacker
        if (!user) {
          console.log('Attemped to refresh token reuse at login');
          // Clear các ReTo còn lại và bắt các thiết bị khác đăng nhập lại
          otherRetos = [];
        }
        res.clearCookie('jwt', {
          httpOnly: true,
          // sameSite: 'None',
          // secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });
      }

      // Save refreshToken in DB
      foundUser.refreshToken = [...otherRetos, newRefreshToken];
      const result = await foundUser.save();
      console.log(result);
      // Save refresh token in file (in database)
      res.cookie('jwt', newRefreshToken, {
        httpOnly: true,
        // sameSite: 'None',
        // secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        accessToken: newAccessToken,
        message: `User ${userLoginName} login successfully!`,
      });
    } else {
      res.status(401).json({
        message: `Wrong password`,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: `Login failed! Error: ${err.message}`,
    });
  }
};

module.exports = login;
