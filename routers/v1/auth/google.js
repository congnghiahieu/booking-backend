const router = require('express').Router();
const mongoose = require('mongoose');
const passport = require('passport');

router.get(
    '/',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
    }),
);

router.get(
    '/callback',
    passport.authenticate('google', {
        failureRedirect: process.env.CLIENT_FAIL_URL,
        session: false,
    }),
    async (req, res) => {
        const newRefreshToken = req.user.genRt();
        req.user.refreshToken = [...req.user.refreshToken, newRefreshToken];
        const result = await req.user.save();
        console.log(result);
        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.redirect(process.env.CLIENT_SUCCESS_URL);
    },
);

module.exports = router;
