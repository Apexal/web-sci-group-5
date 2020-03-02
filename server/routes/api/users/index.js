const express = require('express');
const router = express.Router();
const debug = require('debug')('api');

const User = require('./users.model');

/**
 * Get the current logged in user.
 * 
 * **Response JSON**
 * - logged in user document
 */
router.get('/me', function(req, res) {
    res.json(req.user);
});

router.get('/:userID', async function(req,res) {
    const userID = req.params.userID;
    
    let user;
    try {
        // Try to find user by ID, this fails if userID is not a valid ObjectID
        user = await User.findById(userID).select('_id username name');
    } catch (e) {
        debug(e);
        return res.status(500).json({ error: 'Could not get user.' });
    }

    // Does textbook exist?
    if (!user) {
        debug(`Could not find user with ID ${userID}`);
        return res.status(404).json({ error: 'Could not find user.' });
    }

    res.json(user);
});

module.exports = router;