const express = require('express');
const router = express.Router();
const debug = require('debug')('api');

const Textbook = require('./textbooks.model');

/**
 * Gets a textbook with ID `textbookID`.
 * 
 * **Request Parameters**
 * - `textbookID` ObjectID string
 * 
 * **Response JSON**
 * - the found textbook object or error
 */
router.get('/:textbookID', async function getTextbook(req, res) {
    const textbookID = req.params.textbookID;

    let textbook;
    try {
        // Try to find textbook by ID, this fails if textbookID is not a valid ObjectID
        textbook = await Textbook.findById(textbookID);
    } catch (e) {
        debug(e);
        return res.status(500).json({ error: 'Could not get textbook.' });
    }

    // Does textbook exist?
    if (!textbook) {
        debug(`Could not find textbook with ID ${textbookID}`);
        return res.status(404).json({ error: 'Could not find textbook.' });
    }

    res.json(textbook);
});

module.exports = router;