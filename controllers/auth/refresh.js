const jwt = require('jsonwebtoken');
const UserModel = require('../../model/User');

/*
  GET /v1/auth/refresh
*/
const refreshNewToken = async (req, res) => {
    // Check if lack of info
    // No refresh token in cookie means unauthentication
    const cookies = req?.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    // Exist refresh token
    const refreshToken = cookies.jwt;
    // Delete old cookies
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    });

    const foundUser = await UserModel.findOne({ refreshToken }).exec();
    // Detected refresh token reuse !!! - Có ReTo nhưng không có user
    if (!foundUser) {
        // No user have identical refreshToken means Forbidden (Fake JWT)
        // ReTo đã bị dùng lại nhưng nếu hết hạn thì không sao, nếu còn hạn lập tức xoá hết ReTo hiện tại của user
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SERECT, async (err, decoded) => {
            if (err) return res.sendStatus(403); // ReTo Fake hoặc hết hạn
            // Nếu ReTo còn hạn thì đã bị hack
            console.log('Refresh Token reuse detected: Hacked user');
            const hackedUser = await UserModel.findOne({ username: decoded.username }).exec();
            hackedUser.refreshToken = [];
            const result = hackedUser.save();
            console.log(result);
        });
        return res.sendStatus(403);
    }

    // Có User tức là ReTo an toàn
    const otherReTos = foundUser.refreshToken.filter(rt => rt !== refreshToken);
    // checkJWT - check xem JWT còn hạn không
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SERECT, async (err, decoded) => {
        // JWT hết hạn - Forbidden
        // foundUser.username !== decoded.username. Kiểm tra xem liệu B có lấy refreshToken của A để request hay không
        if (err) {
            // Xoá ReTo cũ khỏi database
            console.log('expired refresh token');
            foundUser.refreshToken = [...otherReTos];
            const result = await foundUser.save();
            console.log(result);
        }
        if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

        // ReTo còn hạn
        const newAccessToken = jwt.sign(
            {
                'UserInfo': {
                    username: foundUser.username,
                    name: foundUser.name,
                    email: foundUser.contact.email,
                    address: foundUser.address,
                    id: foundUser.id,
                    roles: foundUser.roles,
                },
            },
            process.env.ACCESS_TOKEN_SERECT,
            {
                expiresIn: '30s',
            },
        );
        const newRefreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SERECT,
            {
                expiresIn: '1d',
            },
        );
        // Save refreshToken in DB
        foundUser.refreshToken = [...otherReTos, newRefreshToken];
        const result = await foundUser.save();
        console.log(result);
        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            accessToken: newAccessToken,
            message: `Refresh successfully`,
        });
    });
};

module.exports = refreshNewToken;
