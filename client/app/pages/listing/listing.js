"use strict";

angular
  .module("BookIt.listing", ["ngRoute"])
  .config([
    "$routeProvider",
    function($routeProvider) {
      $routeProvider.when("/listing", {
        templateUrl: "pages/listing/listing.html",
        controller: "ListingCtrl"
      });
    }
  ])
  .controller("ListingCtrl", ["$scope", "TextbookListingsService", function($scope, textbookListingsService) {
    $scope.text = 'asdasd';
    
    $scope.textbookListings = [];
    textbookListingsService.fetchTextbookListings()
      .then(listings => {
        console.log(listings)
        $scope.textbookListings = listings
        $scope.$apply();
      });
  }]);
