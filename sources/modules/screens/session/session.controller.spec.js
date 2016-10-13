'use strict';

describe('Controller: sessionController', function () {
    // we work with "vm" instead of "sessionController" to have consistent verbiage
    // in test and controller
    var vm;

    beforeEach(module('app'));
    beforeEach(inject(function ($controller) {
      vm = $controller('sessionController', {}, {});
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