
describe('Controller: homeController', function () {
  'use strict';
    // we work with "vm" instead of "homeController" to have consistent verbiage
    // in test and controller
    var vm;

    beforeEach(module('app'));
    beforeEach(inject(function ($controller) {
      vm = $controller('homeController', {}, {});
  }));

    it('Some data need to be set to display map', function () {
        // vm=this in controller
        expect(vm)
        .toBeDefined();
        // Testing primitives
        expect(vm.center)
        .toBeDefined();
        expect(vm.markers)
        .toBeDefined();
        expect(vm.defaults)
        .toBeDefined();
        expect(vm.isLoading)
        .toBeDefined();
        /*// Testing objects
        expect(vm.model)
            .toBeDefined();
        expect(vm.model.name)
        .toEqual("Batman");*/
    });
});