"use strict";

angular
  .module("BookIt.listing_detail", ["ngRoute"])
  .config([
    "$routeProvider",
    function ($routeProvider) {
      $routeProvider.when("/listing/:listingID", {
        templateUrl: "pages/listing_detail/listing_detail.html",
        controller: "ListingDetailCtrl"
      });
    }
  ])
  .controller("ListingDetailCtrl", ["$scope", "$routeParams", "TextbookListingsService", function ($scope, $routeParams, textbookListingsService) {
    $scope.listing = null;
    textbookListingsService.fetchTextbookListingById($routeParams.listingID)
      .then(textbookListing => {
        $scope.listing = textbookListing;
      })
  }]);
