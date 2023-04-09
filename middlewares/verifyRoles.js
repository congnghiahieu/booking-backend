const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const rolesArray = [...allowedRoles];
    // Unauthentication
    if (!req?.roles) {
      console.log('Không có roles');
      return res.sendStatus(401);
    }
    // Authenticated
    console.log('Allowed roles ', allowedRoles);
    console.log('User roles ', req.roles);
    const isPermitted = req.roles.some(role => allowedRoles.includes(role));
    console.log(`Permission: ${isPermitted ? 'yes' : 'no'}`);
    // If not permitted, user have no right to access API resources - Forbidden
    if (!isPermitted) return res.sendStatus(403);
    next();
  };
};

module.exports = verifyRoles;
