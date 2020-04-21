"use strict";

angular.module("Authentication", []);
angular.module("BookItAPI", []);

// Declare app level module which depends on views, and core components
angular
  .module("BookIt", [
    "Authentication",
    "BookItAPI",
    "ngRoute",
    "BookIt.main",
    "BookIt.user_info",
    "BookIt.listing",
    "BookIt.new_listing",
    "BookIt.version",
  ])
  .config([
    "$locationProvider",
    "$routeProvider",
    function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix("!");

      $routeProvider.otherwise({ redirectTo: "/main" });
    }
  ])
  .run(["AuthService", function (AuthService) {
    AuthService.fetchUser();
  }]);
