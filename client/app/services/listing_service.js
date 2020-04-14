angular.module('myApp', [])
  .factory('listings', ['$http', function($http) {
    const service = {}
    let listings = []

    /** Fetch textbooklistings from the server */
    service.fetchListings = async () => {
      const response = await $http.get('/api/textbooklistings')
      listings = response.data
    }

    service.getListings = () => listings
    
    return service
  }])