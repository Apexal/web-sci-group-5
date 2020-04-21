"use strict";

angular.module("Authentication")
  .factory("AuthService",
  ["$http", function ($http) {
    const service = {};
    let user = null;
    let authenticated = false;

    /** Fetch user from the server */
    service.fetchUser = async () => {
      try {
        const response = await $http.get("/api/users/me");
        user = response.data.user;
        authenticated = true;
        return user;
      } catch (e) {
        authenticated = false;
        return null;
      }
    }

    service.getUser = () => user;
    service.isAuthenticated = () => authenticated;

    // service.fetchUser();

    return service;
  }]);