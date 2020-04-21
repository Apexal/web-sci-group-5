"use strict";

angular.module("BookIt.new_listing", ["ngRoute"])
  .config([
    "$routeProvider",
    function($routeProvider) {
      $routeProvider.when("/listing/new", {
        templateUrl: "pages/new_listing/new_listing.html",
        controller: "NewListingCtrl"
      });
    }
  ])
  .controller("NewListingCtrl", ["$scope", function($scope) {
    
  }]);