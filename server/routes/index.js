const express = require('express');
const router = express.Router();

router.use('/api', require('./api'))

router.get('/ping', (req, res) => {
    res.send('pong');
});

module.exports = router;