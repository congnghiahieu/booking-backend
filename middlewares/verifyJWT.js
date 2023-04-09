const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  // No auth token means unauthentication
  if (!authHeader?.startsWith('Bearer ')) {
    console.log('Không có Auth token');
    return res.sendStatus(401);
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SERECT, (err, decoded) => {
    // Invalid Access token means having no access to API (Forbidden)
    if (err) {
      console.log('Auth Token Error');
      return res.sendStatus(403);
    }
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    console.log('Pass JWT');
    next();
  });
};

module.exports = verifyJWT;
