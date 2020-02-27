const express = require('express');
const router = express.Router();

/**
 * Get the current logged in user.
 * 
 * **Response JSON**
 * - logged in user document
 */
router.get('/me', function(req, res) {
    res.json(req.user);
});

module.exports = router;