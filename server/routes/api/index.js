const express = require('express');
const router = express.Router();

const API_VERSION = '1';

router.get('/version', (req, res) => {
    res.send(API_VERSION);
});

router.use('/textbooks', require('./textbooks'));

module.exports = router;