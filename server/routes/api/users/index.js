const express = require('express');
const router = express.Router();
const debug = require('debug')('api');

const User = require('./users.model');

const USER_PROPERTIES = '_id username name';

/**
 * Gets all users with limited properties.
 * 
 * **Response JSON**
 * - array of User documents
 */
router.get('/', async function (req, res) {
    try {
        const users = await User.find({}).select(USER_PROPERTIES);
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
 * - logged in user document
 */
router.get('/me', function(req, res) {
    res.json(req.user);
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
router.patch('/me', async function(req, res) {
    if (req.body.name) {
        req.user.name = req.body.name;
    }
    try {
        await req.user.save();
    } catch (e) {
        debug(e);
        return res.status(400).json({ error: 'Failed to update user, some values were invalid.' });
    }

    res.json(req.user);
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
router.get('/:userID', async function(req,res) {
    const userID = req.params.userID;
    
    let user;
    try {
        // Try to find user by ID, this fails if userID is not a valid ObjectID
        user = await User.findById(userID).select();
    } catch (e) {
        debug(e);
        return res.status(500).json({ error: 'Could not get user.' });
    }

    // Does user exist?
    if (!user) {
        debug(`Could not find user with ID ${userID}`);
        return res.status(404).json({ error: 'Could not find user.' });
    }

    res.json(user);
});

module.exports = router;