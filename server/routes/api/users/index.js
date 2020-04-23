const express = require('express');
const router = express.Router();
const debug = require('debug')('api');

const { stripe } = require('../../../stripe');

const User = require('./users.model');

const { USER_POPULATE_PROPERTIES } = require('../utils');

/**
 * Gets all users with limited properties.
 * 
 * **Response JSON**
 * - array of User documents
 */
router.get('/', async function (req, res) {
    try {
        const users = await User.find({})
            .select(USER_POPULATE_PROPERTIES)
            .populate('_courses');
        res.json(users);
    } catch (e) {
        debug(e);
        res.status(500).json({ error: 'There was an error getting all users.' });
    }
});

/**
 * Get the current logged in user.
 * 
 * **Response JSON**
 * - user: logged in user document
 */
router.get('/me', function (req, res) {
    res.json({ user: req.user });
});

/**
 * Get the current logged in user.
 * 
 * **Response JSON**
 * - logged in user document
 */
router.get('/me/balance', async function (req, res) {
    const balance = await stripe.balance.retrieve({
        stripeAccount: req.user.stripeAccountID
    })
    res.json({ balance });
});

/**
 * Update the current logged in user.
 * 
 * **Request Body**
 * - name: Object with keys 'first', 'preferred', and 'last'
 * 
 * **Response JSON**
 * - updated user document
 */
router.patch('/me', async function (req, res) {
    if (req.body.name) {
        req.user.name = req.body.name;
    }
    if (req.body._courses) {
        req.user._courses = Array.from(new Set(req.body._courses));
    }

    try {
        await req.user.populate('_courses').execPopulate();
        await req.user.save();
    } catch (e) {
        debug(e);
        return res.status(400).json({ error: 'Failed to update user, some values were invalid.' });
    }

    debug(`Patched profile for ${req.user.username}`);
    res.json({ user: req.user });
});

/**
 * Get limited info on a user with ID `userID`
 * 
 * **Request Params**
 * - userID: ObjectID of existing user document
 * 
 * **Response JSON**
 * - user object with limited properties 
 */
router.get('/:userID', async function (req, res) {
    const userID = req.params.userID;

    let user;
    try {
        // Try to find user by ID, this fails if userID is not a valid ObjectID
        user = await User.findById(userID)
            .select()
            .populate('_courses');
    } catch (e) {
        debug(e);
        return res.status(500).json({ error: 'Could not get user.' });
    }

    // Does user exist?
    if (!user) {
        debug(`Could not find user with ID ${userID}`);
        return res.status(404).json({ error: 'Could not find user.' });
    }

    res.json({ user });
});

module.exports = router;