const express = require('express');
const router = express.Router();

// Login and logout with CAS
router.use(require('./auth'));

// The API routes
router.use('/api', function (req, res, next) {
    if (req.isUnauthenticated()) return res.status(401).json({ error: 'Not authenticated.' });
    next();
}, require('./api'));

module.exports = router;