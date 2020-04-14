"use strict";

angular
  .module("myApp.listing", ["ngRoute"])
  .config([
    "$routeProvider",
    function($routeProvider) {
      $routeProvider.when("/listing", {
        templateUrl: "pages/listing/listing.html",
        controller: "ListingCtrl"
      });
    }
  ])
  .controller("ListingCtrl", ['$scope', 'textbookListings', function($scope, textbookListings) {
    $scope.textbookListings = textbookListings.fetchTextbookListings()
  }]);
