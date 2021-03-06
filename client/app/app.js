"use strict";

angular.module("Authentication", []);
angular.module("Stripe", []);
angular.module("BookItAPI", []);

// Declare app level module which depends on views, and core components
angular
  .module("BookIt", [
    "Authentication",
    "Stripe",
    "BookItAPI",
    "ngRoute",
    "BookIt.main",
    "BookIt.user_info",
    "BookIt.listing",
    "BookIt.listing_detail",
    "BookIt.new_listing",
    "BookIt.version",
  ])
  .config([
    "$locationProvider",
    "$routeProvider",
    function($locationProvider, $routeProvider) {
      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');

      $routeProvider.otherwise({ redirectTo: "/main" });
    }
  ])
  .run(["AuthService", "StripeService", function (AuthService, StripeService) {
    AuthService.fetchUser();
  }]);
