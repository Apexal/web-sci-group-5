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
  .controller("UserInfoCtrl", [function() {}]);
