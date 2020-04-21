'use strict';

angular.module('BookIt.version', [
  'BookIt.version.interpolate-filter',
  'BookIt.version.version-directive'
])

.value('version', '0.1');
