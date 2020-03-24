"use strict";

angular
  .module("myApp.listing", ["ngRoute"])
  .config([
    "$routeProvider",
    function($routeProvider) {
      $routeProvider.when("/listing", {
        templateUrl: "listing/listing.html",
        controller: "ListingCtrl"
      });
    }
  ])
  .controller("ListingCtrl", [function() {}]);
