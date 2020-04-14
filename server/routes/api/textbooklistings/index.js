const express = require('express');
const router = express.Router();
const debug = require('debug')('api');

const { requireAuth } = require('../utils');

const TextbookListing = require('./textbooklistings.model');

/**
 * Get all TextbookListings with optional filters.
 * 
 * **Query Parameters**
 * - sold
 * 
 * **Response JSON**
 * - array of Textbook documents
 */
router.get('/', async function (req, res) {
    const query = {}

    if (req.query.sold) {
        query.sold = req.query.sold === 'true'
    }

    try {
        const textbookListings = await TextbookListing.find(query).populate('_textbook');
        res.json(textbookListings);
    } catch (e) {
        debug(e);
        res.status(500).json({ error: 'There was an error getting all textbook listings.' });
    }
});

/**
 * Middleware to find a TextbookListing from the request parameter 'textbookListingID'.
 * If not found it throws an error and does not continue to the actual controller. 
 */
async function getTextbookListingMiddleware(req, res, next) {
    const textbookListingID = req.params.textbookListingID;

    try {
        res.locals.textbookListing = await TextbookListing.findById(textbookListingID);
    } catch (e) {
        debug(e);
        return res.status(500).json({ error: 'Could not get textbook listing.' });
    }

    if (!res.locals.textbookListing) {
        debug(`Could not find textbook listing with ID ${textbookListingID}`);
        return res.status(404).json({ error: `Could not find textbook listing with id ${textbookListingID}.` });
    }

    next();
}

/**
 * Gets a textbook listing with ID `textbookListingID`.
 * 
 * **Request Parameters**
 * - `textbookListingID` ObjectID string
 * 
 * **Response JSON**
 * - the found TextbookListing document or error
 */
router.get('/:textbookListingID', requireAuth, getTextbookListingMiddleware, async function (req, res) {
    res.json(res.locals.textbookListing);
});

/**
 * Updates a textbook listing with ID `textbookListingID`.
 * 
 * **Request Parameters**
 * - `textbookListingID` ObjectID string
 * 
 * **Request Body**
 * - any textbook listing properties to update (excluding `_id`, `_user`, `_textbook`)
 * 
 * **Response JSON**
 * - the found and updated TextbookListing document or error
 */
router.patch('/:textbookListingID', requireAuth, getTextbookListingMiddleware, async function (req, res) {
    delete req.body._id;
    delete req.body._user;
    delete req.body._textbook;

    res.locals.textbookListing.set(req.body);
    try {
        await res.locals.textbookListing.save();
    } catch (e) {
        debug(e);
        return res.status(500).json({ error: 'Failed to update the textbook listing.' });
    }

    res.json(res.locals.textbookListing);
});

/**
 * Delete a textbook listing with ID `textbookID`.
 * 
 * **Request Parameters**
 * - `textbookListingID` ObjectID string
 * 
 * **Response JSON**
 * - the found and deleted TextbookListing document or error
 */
router.delete('/:textbookListingID', requireAuth, getTextbookListingMiddleware, async function (req, res) {
    try {
        await res.locals.textbookListing.remove();
    } catch (e) {
        debug(e);
        return res.status(500).json({ error: 'Failed to remove the textbook listing.' });
    }

    res.json(res.locals.textbookListing);
});

module.exports = router;