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
    $scope.text = 'asdasd';
    $scope.textbookListings = [];
    textbookListings.fetchTextbookListings()
      .then(listings => {
        console.log(listings)
        $scope.textbookListings = listings
        $scope.$apply();
      })
  }]);
