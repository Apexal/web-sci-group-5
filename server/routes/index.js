const express = require('express');
const router = express.Router();

// Login and logout with CAS
router.use(require('./auth'));

router.get('/', function (req, res) {
    res.json(req.user);
});

router.use('/api', require('./api'));

module.exports = router;