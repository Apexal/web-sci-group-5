"use strict";

angular
  .module("BookIt.user_info", ["ngRoute"])
  .config([
    "$routeProvider",
    function($routeProvider) {
      $routeProvider.when("/user_info", {
        templateUrl: "pages/user_info/user_info.html",
        controller: "UserInfoCtrl"
      });
    }
  ])
  .controller("UserInfoCtrl", ["$scope", "AuthService", "CoursesService", function($scope, AuthService, CoursesService) {
    $scope.user = AuthService.getUser();
    $scope.name = { first: '', last: '' };

    if ($scope.user) {
      $scope.name = $scope.user.name;
    }

    $scope.search = "";
    function updateCourses () {
      if ($scope.search) {
        CoursesService.searchCourses($scope.search).then(courses => {
          $scope.courses = courses;
        });
      } else {
        $scope.courses = [];
      }
    }

    $scope.$watch("search", updateCourses);


    // User courses
    $scope.addCourse = function (courseID) {
      const newCourseIDs = [...$scope.user._courses.map(c => c._id), courseID];

      AuthService.updateUser({ _courses: newCourseIDs });
    };
    
    $scope.removeCourse = function (courseID) {
      const newCourseIDs = $scope.user._courses.map(c => c._id).filter(id => id !== courseID);

      AuthService.updateUser({ _courses: newCourseIDs });
    };

    $scope.$on("user-changed", function () {
      $scope.user = AuthService.getUser();
      $scope.name = $scope.user.name;
      $scope.$apply();
    });

    $scope.submitForm = function (event) {
      AuthService.updateUser({ name: $scope.name });
      alert("Updated!");
    };
  }]);
