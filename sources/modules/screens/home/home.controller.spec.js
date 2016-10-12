describe('Controller: homeController', function () {
    // we work with "vm" instead of "homeController" to have consistent verbiage
    // in test and controller
    var vm;

    beforeEach(module('app'));
    beforeEach(inject(function ($controller) {
      vm = $controller('homeController', {}, {});
    }));

    it('should have vm.model defined and homeController.vm.model is equal to controllerAs vm test', function () {
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