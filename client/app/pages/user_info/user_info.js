"use strict";

angular
  .module("BookIt.user_info", ["ngRoute"])
  .config([
    "$routeProvider",
    function($routeProvider) {
      $routeProvider.when("/user_info", {
        templateUrl: "pages/user_info/user_info.html",
        controller: "UserInfoCtrl"
      });
    }
  ])
  .controller("UserInfoCtrl", ["$scope", "AuthService", function($scope, AuthService) {
    $scope.user = AuthService.getUser();
    $scope.isAuthenticated = AuthService.isAuthenticated();
    
    $scope.$on("auth-changed", function () {
      $scope.user = AuthService.getUser();
      $scope.isAuthenticated = AuthService.isAuthenticated();
      $scope.$apply();
    });
  }]);
