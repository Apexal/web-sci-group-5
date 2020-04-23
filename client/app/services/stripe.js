"use strict";

angular.module("Stripe")
  .factory("StripeService",
  ["$rootScope", "AuthService", function ($rootScope, AuthService) {
    const service = {};
    let stripe = null;
    let elements = null;

    const initalizeWithUser = function () {
      if (AuthService.isAuthenticated()) {
        stripe = Stripe('pk_test_2AWcc2JXkSdRmMfyuOaIOiT300aORiftsc', /*/{
          stripeAccount: AuthService.getUser().stripeAccountID
        }*/);
        elements = stripe.elements();
        console.log("Initialized Stripe and elements");
      } else {
        stripe = null;
        elements = null;
      }
    }

    $rootScope.$on("user-changed", initalizeWithUser);

    service.stripe = () => stripe;
    service.elements = () => elements;

    return service;
  }]);