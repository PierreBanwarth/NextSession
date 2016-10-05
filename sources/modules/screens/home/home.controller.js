(function() {

  'use strict';

  angular
    .module('app')
    .controller('homeController', HomeController);
  /**
   * Displays the home screen.
   * @constructor
   */
  function HomeController(logger,
                          stationService,
                          quoteService) {
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
    /*
     * Internal
     */

    /**
     * Init controller.
     */
    function init() {

      logger.log('init stations');
      stationService
        .getAllStation()
        .then(function(AllStation) {
          vm.AllStation = AllStation;
          vm.center = {
            lat: vm.AllStation.zone.areas[0].area_map_lat,
            lng: vm.AllStation.zone.areas[0].area_map_lng,
            zoom: vm.AllStation.zone.areas[0].map_level
          };
          var stations = vm.AllStation.zone.areas[0].stations;
          vm.markers = [];
          for(var i=0; i<stations.length; i++){
            var marker = {
              lat: stations[i].station_lat,
              lng: stations[i].station_lng,
              focus: false,
              message: stations[i].station_name,
              draggable: false            
            }
            vm.markers.push(marker);
          }
        })
        .finally(function() {
          vm.isLoading = false;
        });
    }
    init();

  }

})();
