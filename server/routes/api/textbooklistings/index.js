const express = require('express');
const router = express.Router();
const debug = require('debug')('api');

const { USER_POPULATE_PROPERTIES, requireAuth, requireAdmin } = require('../utils');

const Textbook = require('../textbooks/textbooks.model');
const TextbookListing = require('./textbooklistings.model');

/**
 * Get all TextbookListings with optional filters.
 * 
 * **Query Parameters**
 * - sold (optional) 'true' or 'false' for whether or not to included sold listings (default false)
 * 
 * **Response JSON**
 * - textbookListings: array of TextbookListing documents
 */
router.get('/', async function (req, res) {
    const query = {
        sold: false
    }

    if ('sold' in req.query) {
        query.sold = req.query.sold === 'true'
    }

    try {
        const textbookListings = await TextbookListing
            .find(query)
            .populate('_textbook')
            .populate('_user', USER_POPULATE_PROPERTIES);
        res.json({ textbookListings });
    } catch (e) {
        debug(e);
        res.status(500).json({ error: 'There was an error getting all textbook listings.' });
    }
});

/**
 * Create a new textbooklisting for the current user.
 * 
 * **Request Body**
 * - textbookID: ObjectID string of desired Textbook
 * - condition: The condition of the textbook
 * - proposedPrice: Decimal price for the textbook listing
 * 
 * **Response JSON**
 * - createdTextbookListing: Created TextbookLisiting document
 */
router.post('/', requireAuth, async function (req, res) {
    const { textbookID, condition, proposedPrice } = req.body;

    // Validate presence of request
    if (!textbookID || !condition || !proposedPrice) {
        return res.status(400).json({ error: 'Invalid request body. Be sure to pass `textbookID`, `condition`, and `proposedPrice`.' });
    }

    // Find textbook
    let textbook;
    try {
        textbook = await Textbook.findById(textbookID);
    } catch (e) {
        return res.status(400).json({ error: 'Failed to find associated textbook.' });
    }

    const textbookListingData = {
        _user: req.user,
        _textbook: textbook,
        condition,
        proposedPrice,
        sold: false
    }

    const createdTextbookListing = new TextbookListing(textbookListingData);

    try {
        await createdTextbookListing.save();
    } catch (e) {
        debug(`Failed to put textbook up for sale for ${req.user.username}: ${e}`);
        return res.status(400).json({ error: 'There was an error putting the textbook up for sale.' });
    }

    debug(`${req.user.username} put up a ${condition}-condition ${textbook.title} ${textbook.edition} ed. textbook for $${proposedPrice}`);
    res.status(201).json({ createdTextbookListing });
});

/**
 * Middleware to find a TextbookListing from the request parameter 'textbookListingID'.
 * If not found it throws an error and does not continue to the actual controller. 
 */
async function getTextbookListingMiddleware(req, res, next) {
    const textbookListingID = req.params.textbookListingID;

    try {
        res.locals.textbookListing = await TextbookListing
            .findById(textbookListingID)
            .populate('_textbook')
            .populate('_user', USER_POPULATE_PROPERTIES);
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
 * - textbookListing: the found TextbookListing document or error
 */
router.get('/:textbookListingID', requireAuth, getTextbookListingMiddleware, async function (req, res) {
    res.json({ textbookListing: res.locals.textbookListing });
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
 * - textbookListing: the found and updated TextbookListing document or error
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

    res.json({ textbookListing: res.locals.textbookListing });
});

/**
 * Delete a textbook listing with ID `textbookID`.
 * 
 * **Request Parameters**
 * - `textbookListingID` ObjectID string
 * 
 * **Response JSON**
 * - textbookListing: the found and deleted TextbookListing document or error
 */
router.delete('/:textbookListingID', requireAuth, getTextbookListingMiddleware, async function (req, res) {
    try {
        await res.locals.textbookListing.remove();
    } catch (e) {
        debug(e);
        return res.status(500).json({ error: 'Failed to remove the textbook listing.' });
    }

    res.json({ textbookListing: res.locals.textbookListing });
});

module.exports = router;