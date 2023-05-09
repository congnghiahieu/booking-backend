const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Unauthentication
        if (!req?.roles) {
            console.log('Không có roles');
            return res.sendStatus(401);
        }
        // Authenticated
        const isPermitted = req.roles.some(role => allowedRoles.includes(role));
        console.log(`Permission: ${isPermitted ? 'yes' : 'no'}`);
        // If not permitted, user have no right to access API resources - Forbidden
        if (!isPermitted) return res.sendStatus(403);
        next();
    };
};

module.exports = verifyRoles;
