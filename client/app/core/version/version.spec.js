'use strict';

describe('BookIt.version module', function() {
  beforeEach(module('BookIt.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
