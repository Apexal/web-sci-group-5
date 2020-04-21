"use strict";

angular.module("Stripe")
  .factory("StripeService",
  ["$rootScope", "AuthService", function ($rootScope, AuthService) {
    const service = {};
    let stripe = null;

    const initalizeWithUser = function () {
      if (AuthService.isAuthenticated()) {
        stripe = Stripe('pk_test_2AWcc2JXkSdRmMfyuOaIOiT300aORiftsc', {
          stripeAccount: AuthService.getUser().stripeAccountID
        });
        console.log("Initialized Stripe");
      } else {
        stripe = null;
      }
    }

    $rootScope.$on("user-changed", initalizeWithUser);

    return service;
  }]);