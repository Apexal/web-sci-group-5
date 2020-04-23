const express = require('express');
const router = express.Router();
const debug = require('debug')('api');

const { stripe } = require('../../../stripe');

router.get('/onboard', async function (req, res) {
  const accountLinks = await stripe.accountLinks.create({
    account: req.user.stripeAccountID,
    failure_url: 'https://example.com/failure',
    success_url: 'https://example.com/success',
    type: 'custom_account_verification',
    collect: 'eventually_due',
  });

  res.status(200).json({ url: accountLinks.url });
}); 

module.exports = router;