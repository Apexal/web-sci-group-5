angular.module("BookIt").component("bHeader", {
    templateUrl: "components/header/header.html",
    bindings: {
    }
  })
  .controller("HeaderCtrl", ["$scope", "AuthService", function ($scope, AuthService) {
    $scope.user = AuthService.getUser();
    $scope.isAuthenticated = AuthService.isAuthenticated();
    
    $scope.$on("user-changed", function () {
      $scope.user = AuthService.getUser();
      $scope.isAuthenticated = AuthService.isAuthenticated();
      $scope.$apply();
    });
  }]);