const stripe = require('stripe')(process.env.STRIPE_API_KEY);

/**
 * The fee to collect on each TextbookListing by the platform (cents).
 */
const fee = module.exports.APPLICATION_FEE = 100;

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

module.exports.checkoutTextbookListing = async function checkoutTextbookListing (user, textbookListing) {
  const paymentIntent = await stripe.paymentIntents.create({
    payment_method_types: ['card'],
    application_fee_amount: fee,
    transfer_data: {
      destination: textbookListing._user.stripeAccount,
    },
    amount: textbookListing.proposedPrice * 100,
    currency: 'usd',
    metadata: {integration_check: 'accept_a_payment'},
  });

  return paymentIntent
}