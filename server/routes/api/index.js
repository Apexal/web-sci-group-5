const express = require('express');
const router = express.Router();

const { requireAuth } = require('./utils');

const API_VERSION = '1';

router.get('/version', (req, res) => {
    res.send(API_VERSION);
});

router.use('/users', requireAuth, require('./users'));
router.use('/courses', require('./courses'));
router.use('/textbooks', require('./textbooks'));
router.use('/textbooklistings', require('./textbooklistings'));

module.exports = router;