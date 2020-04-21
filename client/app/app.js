"use strict";

angular.module("Authentication", []);
angular.module("BookItAPI", []);

// Declare app level module which depends on views, and core components
angular
  .module("myApp", [
    "Authentication",
    "BookItAPI",
    "ngRoute",
    "myApp.main",
    "myApp.user_info",
    "myApp.listing",
    "myApp.version",
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
