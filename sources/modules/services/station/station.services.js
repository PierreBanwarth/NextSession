(function() {
    'use strict';
    angular
    .module('app')
    .factory('stationService', stationService);
	/**
	* station service: allows to get station of the day.
	*/
	function stationService($q,
    contextService,
    webStationService,
    logger) {
    /*
     * Public interface
     */
     var center;
     var service = {};
     var markers = [];
     var dataStation;
     var allStation;
     logger = logger.getLogger('station');

     service.updateDataStation = function() {
      return webStationService
      .getDataStation()
      .then(function(response) {
        dataStation = response;
        return webStationService.getAllStation()
        .then(function(allStationResult) {
          allStation = allStationResult;
          dataMerge();
        })
        .catch(function() {
          logger.log('error while tryng to get allstation');
        });
      })
      .catch(function() {
        logger.log('error while trying to get dataStation');
      });      
    };
    service.getCentre = function() {
      if (center && angular.isDefined(center)) {
        return center;
      }
    };
    service.getMarkers = function() {
      if (markers && angular.isDefined(markers)) {
        return markers;              
      }
      return 'error';
    };
    /*
    * this function is merging data from two different web services.
    */
    var dataMerge = function() {
      center = {
        lat:  allStation.zone.areas[0].area_map_lat,
        lng:  allStation.zone.areas[0].area_map_lng,
        zoom: allStation.zone.areas[0].map_level
      };
      var stations = allStation.zone.areas[0].stations;
      
      for ( var i = 0; i < stations.length; i++) {
        var id = stations[i].station_id;
        if (id) {
          var availableCar =  dataStation[id].station.available_car;
          var totalCar =  dataStation[id].station.parking_space_free;
          var marker = {
            lat: stations[i].station_lat,
            lng: stations[i].station_lng,

            focus: false,
            name: stations[i].station_name,
            // + ' ' + availableCar + '/' + totalCar,
            draggable: false,
            availableCar: availableCar,
            totalSpace: totalCar
          };
          markers.push(marker);
        }
      }
    };

    return service;
  }
})();
