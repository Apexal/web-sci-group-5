"use strict";

angular
  .module("BookIt.main", ["ngRoute"])
  .config([
    "$routeProvider",
    function ($routeProvider) {
      $routeProvider.when("/main", {
        templateUrl: "pages/main/main.html",
        controller: "MainCtrl"
      });
    }
  ])
  .controller("MainCtrl", ["$scope", "TextbookListingsService", function ($scope, textbookListingsService) {
    $scope.getDate = function (createdAt) {
      const now = new Date();
      const creation = new Date(createdAt);

      const diff = now.getTime() - creation.getTime();

      return Math.floor(diff / (1000 * 3600 * 24));
    }

    $scope.textbookListings = [];
    textbookListingsService.fetchTextbookListings()
      .then(listings => {
        $scope.textbookListings = listings;
        $scope.$apply();
      });
  }]);
