"use strict";

// Declare app level module which depends on views, and core components
angular
  .module("myApp", [
    "ngRoute",
    "myApp.main",
    "myApp.user_info",
    "myApp.listing",
    "myApp.version"
  ])
  .config([
    "$locationProvider",
    "$routeProvider",
    function($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix("!");

      $routeProvider.otherwise({ redirectTo: "/main" });
    }
  ])
  .factory('textbookListings', ['$http', function($http) {
    const service = {}
    let listings = []

    /** Fetch textbooklistings from the server */
    service.fetchTextbookListings = async () => {
      const response = await $http.get('http://localhost:3000/api/textbooklistings')
      listings = response.data
      return listings
    }

    service.getTextbookListings = () => listings
    
    return service
  }]);
