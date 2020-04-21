"use strict";

describe("BookIt.user_info module", function() {
  beforeEach(module("BookIt.user_info"));

  describe("user_info controller", function() {
    it("should ....", inject(function($controller) {
      //spec body
      var UserInfoCtrl = $controller("UserInfoCtrl");
      expect(UserInfoCtrl).toBeDefined();
    }));
  });
});
