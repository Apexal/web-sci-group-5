const express = require('express');
const router = express.Router();

const CASAuthentication = require('cas-authentication');

const cas = new CASAuthentication({
  cas_url: 'https://cas-auth.rpi.edu/cas',
  cas_version: '3.0',
  service_url: process.env.CAS_SERVICE_URL
});

function studentPostLogin (req, res) {
  // Do things...
  res.redirect('/');
}

/* CAS Authentication */
router.get('/login', cas.bounce, studentPostLogin);
router.get('/logout', cas.logout);

module.exports = router;