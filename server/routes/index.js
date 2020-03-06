const express = require('express');
const router = express.Router();
const debug = require('debug')('api');

/* Middlware that all requests pass through first */
router.use(function (req, res, next) {
    next();
});

// Login and logout with CAS
router.use(require('./auth'));

// The API routes
router.use('/api', function (req, res, next) {
    if (req.isUnauthenticated()) return res.status(401).json({ error: 'Not authenticated.' });
    next();
}, require('./api'), function (req, res) {
    return res.status(404).json({ error: 'API route not found.' });
});

router.use(function (err, req, res, next) {
    debug(err);
    if (process.env.NODE_ENV === 'development') {
        res.status(500).json({ error: err.message });
    } else {
        res.status(500).json({ error: 'An error occurred!' });
    }
});

module.exports = router;