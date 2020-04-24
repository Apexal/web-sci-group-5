"use strict";

angular
  .module("BookIt.listing_detail", ["ngRoute"])
  .config([
    "$routeProvider",
    function ($routeProvider) {
      $routeProvider.when("/listing/:listingID", {
        templateUrl: "pages/listing_detail/listing_detail.html",
        controller: "ListingDetailCtrl"
      });
    }
  ])
  .controller("ListingDetailCtrl", ["$scope", "$routeParams", "StripeService", "TextbookListingsService", function ($scope, $routeParams, StripeService, TextbookListingsService) {
    $scope.listing = null;
    TextbookListingsService.fetchTextbookListingById($routeParams.listingID)
      .then(textbookListing => {
        $scope.listing = textbookListing;
      });
    
    let clientSecret = null;
    let stripeCard = null;
    $scope.checkingOut = false;
    $scope.checkout = function () {
      if ($scope.checkingOut) {
        $("#payment-modal").modal("show");
      } else {
        TextbookListingsService.checkoutTextbookListing($scope.listing._id).then(cs => {
          clientSecret = cs;
          $scope.checkingOut = true;
          stripeCard = StripeService.elements().create("card");
          stripeCard.mount("#card-element");
          $("#payment-modal").modal("show");
  
          stripeCard.addEventListener("change", ({error}) => {
            const displayError = document.getElementById("card-errors");
            if (error) {
              displayError.textContent = error.message;
            } else {
              displayError.textContent = '';
            }
          });
        });
      }
    };

    $scope.finishPayment = async function finishPayment () {
      const result = await StripeService.stripe().confirmCardPayment(clientSecret, {
        payment_method: {
          card: stripeCard,
          billing_details: {
            name: 'Full Name'
          }
        }
      });

      if (result.error) {
        // Show error to your customer (e.g., insufficient funds)
        alert(result.error.message);
      } else {
        // The payment has been processed!
        if (result.paymentIntent.status === 'succeeded') {
          // Show a success message to your customer
          // There's a risk of the customer closing the window before callback
          // execution. Set up a webhook or plugin to listen for the
          // payment_intent.succeeded event that handles any business critical
          // post-payment actions.
          alert("Your purchase has been confirmed!");
        }
      }
    };
  }]);
