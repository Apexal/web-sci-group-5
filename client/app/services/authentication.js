"use strict";

angular.module("Authentication")
  .factory("AuthService",
  ["$rootScope", "$http", function ($rootScope, $http) {
    const service = {};
    let user = null;
    let authenticated = false;

    /** Fetch user from the server */
    service.fetchUser = async () => {
      try {
        const response = await $http.get("/api/users/me");
        user = response.data.user;
        console.log("Logged in");
        authenticated = true;
        $rootScope.$broadcast("auth-changed");
        return user;
      } catch (e) {
        authenticated = false;
        console.log("Logged out");
        $rootScope.$broadcast("auth-changed");
        return null;
      }
    }

    service.getUser = () => user;
    service.isAuthenticated = () => authenticated;

    return service;
  }]);