const express = require('express');
const router = express.Router();

// Login and logout with CAS
router.use(require('./auth'));

function requireCAS (req, res, next) {
    if ('cas_user' in req.session) return next();

    res.status(401).json({
        error: 'You must be logged in to access the API.'
    });
}

router.use('/api', requireCAS, require('./api'));

module.exports = router;