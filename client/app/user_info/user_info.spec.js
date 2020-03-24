"use strict";

describe("myApp.user_info module", function() {
  beforeEach(module("myApp.user_info"));

  describe("user_info controller", function() {
    it("should ....", inject(function($controller) {
      //spec body
      var UserInfoCtrl = $controller("UserInfoCtrl");
      expect(UserInfoCtrl).toBeDefined();
    }));
  });
});
