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
        $rootScope.$broadcast("user-changed");
        return user;
      } catch (e) {
        authenticated = false;
        console.log("Logged out");
        $rootScope.$broadcast("user-changed");
        return null;
      }
    };
    service.updateUser = async updates => {
      const response = await $http.patch("/api/users/me", updates);
      user = response.data.user;
      $rootScope.$broadcast("user-changed");
    };
    service.getUser = () => user;
    service.isAuthenticated = () => authenticated;

    return service;
  }]);