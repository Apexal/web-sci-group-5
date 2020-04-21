"use strict";

angular
  .module("BookIt.main", ["ngRoute"])
  .config([
    "$routeProvider",
    function($routeProvider) {
      $routeProvider.when("/main", {
        templateUrl: "pages/main/main.html",
        controller: "MainCtrl"
      });
    }
  ])
  .controller("MainCtrl", [function() {}]);
