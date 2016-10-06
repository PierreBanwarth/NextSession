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
          .getDataStation()
          .then( function( dataStation){
            vm.dataStation = dataStation;
            console.log(vm.dataStation);
      });

      stationService
        .getAllStation()
        .then(function(allStation) {
          vm.allStation = allStation;
          vm.center = {
            lat:  vm.allStation.zone.areas[0].area_map_lat,
            lng:  vm.allStation.zone.areas[0].area_map_lng,
            zoom: vm.allStation.zone.areas[0].map_level
          };
          var stations = vm.allStation.zone.areas[0].stations;
          vm.markers = [];
          for ( var i = 0; i < stations.length; i++){
            var id = stations[i].station_id;
            if ( id){
              var availableCar =  vm.dataStation[id].station.available_car;
              var totalCar =  vm.dataStation[id].station.parking_space_free;
              var marker = {
              lat: stations[i].station_lat,
              lng: stations[i].station_lng,
              focus: false,
              message: stations[i].station_name + ' ' + availableCar + '/' + totalCar,
              draggable: false,
              availableCar: availableCar,
              totalSpace: totalCar
            };
            vm.markers.push(marker);
            }
          }
        })
        .finally(function() {
          vm.isLoading = false;
        });
    }
    init();
  }
})();
