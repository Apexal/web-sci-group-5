const express = require('express');
const router = express.Router();
const debug = require('debug')('app');
const passport = require('passport');
const CasStrategy = require('passport-cas2').Strategy;

const User = require('./api/users/users.model')

const cas = new CasStrategy({
    casURL: 'https://cas-auth.rpi.edu/cas',
},
    async function (username, profile, done) {
        username = username.toLowerCase().trim();

        // Find or create User from username
        try {
            let user = await User.findOne({ username });

            if (!user) {
                user = new User({
                    username
                });
                await user.save();
                debug(`Created new user '${username}'`);
            }
            debug(`Logged in '${username}'`);
            return done(null, user);
        } catch (e) {
            return done(e);
        }
    }
);

passport.use(cas);

router.get('/login', passport.authenticate('cas'), function (req, res) {
    res.redirect('/');
});

if (process.env.NODE_ENV === 'development') {
    router.get('/test/loginAs', async function (req, res, next) {
        const username = req.query.username;
        const user = await User.findOne({ username });
        req.login(user, function (err) {
            if (err) return next(err);
            return res.redirect('/api/users/me');
        });
    });
}

router.get('/logout', function (req, res) {
    debug(`Loggout out '${req.user.username}'`);
    cas.logout(req, res);
});

passport.serializeUser(function (user, done) {
    done(null, user.username);
});

passport.deserializeUser(async function (username, done) {
    const user = await User.findOne({ username });
    return done(null, user);
});

module.exports = router;