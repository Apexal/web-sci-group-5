const express = require('express');
const router = express.Router();

// Login and logout with CAS
router.use(require('./auth'));

// The API routes
router.use('/api', function (req, res, next) {
    if (req.isUnauthenticated()) return res.status(401).json({ error: 'Not authenticated.' });
    next();
}, require('./api'), function(req, res) {
    return res.status(404).json({ error: 'API route not found.' });
});

module.exports = router;