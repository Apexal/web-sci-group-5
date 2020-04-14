"use strict";

angular
  .module("myApp.main", ["ngRoute"])
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
