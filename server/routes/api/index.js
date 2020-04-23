const express = require('express');
const router = express.Router();

const { requireAuth } = require('./utils');

const API_VERSION = '1';

router.get('/version', (req, res) => {
    res.json({ version: API_VERSION });
});

router.use('/users', requireAuth, require('./users'));
router.use('/courses', require('./courses'));
router.use('/textbooks', require('./textbooks'));
router.use('/textbooklistings', require('./textbooklistings'));
router.use('/stripe', requireAuth, require('./stripe'));

module.exports = router;