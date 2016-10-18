(function() {
  'use strict';

  angular
  .module('app')
  .controller('homeController', homeController);
  /**
   * Displays the home screen.
   * @constructor
   */
   function homeController(logger,stationService) {
    logger = logger.getLogger('home');
    /*
     * View model
     */
     var vm = this;
     vm.isLoading = true;
    //fix an error with not set center caused by leaflet
    vm.center = {
      lat: 45.188616,
      lng: 5.725969,
      zoom: 1
    };
    vm.defaults = {
      zoomControlPosition: 'topright'
    };
    vm.markers = [];
    /*
    * load data is calling a updating service and update data such as center and markers.
    */
    var loadData = function() {
      return stationService.updateDataStation()
      .then(function(result) {
        vm.center = stationService.getCentre();
        vm.markers = stationService.getMarkers();
        return result;
      })
      .catch(function() {
        logger.log('error while tryng to updateDataStation');
      });
    };
    var init = function() {
      logger.log('init stations');
      loadData().catch(function() {
        logger.log('error while loading datas');
      })
      .finally(function() {
        vm.isLoading = false;
      });
    };
    init();
  }
})();
