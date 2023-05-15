const UserModel = require('../../model/User');

/*
  GET /v1/auth/logout
*/
const logout = async (req, res) => {
    // On Client also delete accessToken, accessToken = null;
    const cookies = req?.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    // Check is refreshToken in DB
    const foundUser = await UserModel.findOne({ refreshToken }).exec();

    if (!foundUser) {
        // console.log('Logout: Not found user');
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.sendStatus(204);
    }

    // console.log('Logout: clear JWT');
    // Xoá refreshToken trong DB
    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);
    const result = await foundUser.save();
    // Clear cookie ở client
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    });
    res.sendStatus(204);
};

module.exports = logout;
