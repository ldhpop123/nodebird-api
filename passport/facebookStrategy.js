const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

const User = require('../models/user');

module.exports = () => {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: '/auth/facebook/callback',
    }, async (accessToken, refreshToken, profile, done) => {
        console.log('facebook profile', profile);
        try {
            const exUser = await User.findOne({ 
                where: { snsId: profile.id.toString(), provider: 'facebook'}, 
            });
            if (exUser) {
                done(null, exUser);
            } else { 
                const newUser = await User.create({ 
                    email: profile.emails[0].value,
                    nick: profile.displayName,
                    snsId: profile.id.toString(),
                    provider: 'facebook', 
                });
                done(null, newUser); 
            }
        } catch (error) { 
            console.error(error); 
            done(error);  
        }
    }));
};