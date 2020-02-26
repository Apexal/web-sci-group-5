const express = require('express');
const router = express.Router();

const controller = require('./textbooks.controller')

router.get('/:textbookID', controller.getTextbook)

module.exports = router;