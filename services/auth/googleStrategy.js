const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const UserModel = require('../../model/User');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            const foundUser = await UserModel.find({ googleId: profile.id }).exec();
            if (foundUser.length != 0) {
                return done(null, foundUser[0]);
            }
            // console.log('This is a new user');
            const newUser = await UserModel.create({
                googleId: profile.id,
                name: `${profile.given_name} ${profile.family_name}`,
                contact: {
                    email: profile.email,
                },
                address: {
                    nation: profile.locale === 'undefined' ? 'Việt Nam' : profile.locale,
                },
                avatarUrl: profile.photos.value,
            });

            return done(null, newUser);
        },
    ),
);
