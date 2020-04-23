angular.module("BookItAPI")
  .factory("TextbookListingsService", ["$http", function($http) {
    const service = {};
    let listings = [];

    /* Fetch textbooklistings from the server */
    service.fetchTextbookListings = function () {
      return $http.get("/api/textbooklistings").then(function(response) {
        return response.data.textbookListings;
      });
    };
    
    /* Fetch textbooklistings from the server */
    service.fetchTextbookListingById = function (id) {
      return $http.get("/api/textbooklistings/" + id).then(function(response) {
        return response.data.textbookListing;
      });
    };
    
    /* Create a Stripe PaymentIntent on the server and get the client secret */
    service.checkoutTextbookListing = function (id) {
      return $http.post("/api/textbooklistings/" + id + "/checkout").then(function(response) {
        return response.data.clientSecret;
      });
    };

    service.getTextbookListings = () => listings;

    return service;
  }])
  .factory("CoursesService", ["$http", "$q", function($http, $q) {
    const service = {};
    
    /** Search courses from the server */
    service.searchCourses = function (search) {
      return $http.get("/api/courses", { params: { termCode: "202001", search } }).then(function(response) {
        return response.data.courses;
      });
    }

    return service;
  }]);
  