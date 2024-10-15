const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');

const generateRandomFlag = () => {
    return Math.random().toString(36).substring(2, 10); 
};

module.exports = function () {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:8000/auth/google/callback',
        scope: ['profile', 'email'],
    },
        async (accessToken, refreshToken, profile, done) => {
            const allowedDomain = 'student.nitw.ac.in'; // Only students of NITW are allowed
            const userEmail = profile.emails[0].value;

            if (userEmail.endsWith(`@${allowedDomain}`)) {
                let username = userEmail.split("@")[0];

                let user = await User.findOne({ email: userEmail });
                if (user) {
                    // Update the user's profile if needed (you can modify this if required)
                    return done(null, { user: user, accessToken: accessToken });
                }

                const newUser = new User({
                    username: username,
                    email: userEmail,
                    flags: Array.from({ length: 5 }, generateRandomFlag), 
                    levelFinished: Array(5).fill(false)
                });

                await newUser.save();
                return done(null, { user: newUser, accessToken: accessToken });
            } else {
                return done(null, false, { message: "Please login with only student email" });
            }
        }));

    // Serialize user to store in session
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    // Deserialize user from session
    passport.deserializeUser(async (user, done) => {
        done(null, user);
    });
};
