const express = require('express');
const router = express.Router();

const passport = require('passport');
const CasStrategy = require('passport-cas2').Strategy;

const cas = new CasStrategy({
  casURL: 'https://cas-auth.rpi.edu/cas',
},
  function (username, profile, done) {
    // TODO: find or create Student from username
    username = username.toLowerCase();

    done(null, { username });
  }
);

passport.use(cas);

router.get('/login', passport.authenticate('cas'), function (req, res) {
  res.redirect('/success');
})

router.get('/logout', function (req, res) {
  var returnURL = 'http://localhost:5000';
  cas.logout(req, res, returnURL);
});

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  done(null, { username });
});

module.exports = router;