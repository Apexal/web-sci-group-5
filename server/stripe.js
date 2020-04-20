const stripe = require('stripe')(process.env.STRIPE_API_KEY);

module.exports.stripe = stripe;

/**
 * @param user User document
 */
module.exports.createUserAccount = function createUserAccount () {
  return stripe.accounts.create({
    country: 'US',
    type: 'custom',
    requested_capabilities: ['card_payments', 'transfers']
  });
}