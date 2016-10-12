(function() {

  'use strict';

  angular
  .module('app')
  .controller('sessionController', sessionController);
  /**
   * Displays the home screen.
   * @constructor
   */
   function sessionController(logger,
    sessionService) {
    logger = logger.getLogger('home');
    /*
     * View model
     */

     var vm = this;

     vm.isLoading = true;
     vm.quote = null;
    //fix an error with not set center caused by leaflet
    vm.center = {
      lat: 45.188616,
      lng: 5.725969,
      zoom: 1
    };
    vm.defaults= {
      zoomControlPosition: 'topright'
    }
    /*
     * Internal
     */

    /**
     * Init controller.
     */
    function init() { 

      logger.log('init stations');
      sessionService
      .getSessions()
      .then(function(dataSession) {
        console.log(dataSession);
        vm.dataSession = dataSession;
        console.log(vm.dataSession);
      }).finally(function() {
        vm.isLoading = false;
      });
       vm.markers = sessionService.getMarkers();
    }
    init();
  }
})();
