angular.module("BookItAPI")
  .factory("TextbookListingsService", ["$http", function($http) {
    const service = {};
    let listings = [];

    /** Fetch textbooklistings from the server */
    service.fetchTextbookListings = async () => {
      const response = await $http.get('/api/textbooklistings');
      listings = response.data.textbookListings;
      return listings;
    }

    service.getTextbookListings = () => listings;

    return service;
  }]);
  