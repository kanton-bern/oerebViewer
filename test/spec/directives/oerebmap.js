'use strict';

describe('Directive: oerebMap', function () {

  // load the directive's module
  beforeEach(module('oerebApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<oereb-map></oereb-map>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the oerebMap directive');
  }));
});
