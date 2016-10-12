(function() {
  'use strict';
  angular
  .module('app')
  .factory('sessionService', sessionService);
	/**
	* station service: allows to get station of the day.
	*/
	function sessionService($q,
    contextService,
    webSessionService,
    logger) {
    /*
     * Public interface
     */
     var center;
     var service = {};
     var markers = [];
     var dataSession;
     logger = logger.getLogger('station');

     service.getSessions = function() {
      return webSessionService
      .getSessions()
      .then(function(response) {
        dataSession = response;
        dataMerge();
        return dataSession;
      })
      .catch(function() {
        logger.log('error while trying to get dataSession');
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
      var sessions = dataSession;
      for ( var i = 0; i < sessions.length; i++) {
        console.log(sessions[i])  
          var marker = {
            lat: sessions[i].geometry.coordinates[1],
            lng: sessions[i].geometry.coordinates[0],

            focus: false,
            name: sessions[i].properties.name,
            // + ' ' + availableCar + '/' + totalCar,
            draggable: false,
          };
          markers.push(marker);
        }
    };

    return service;
  }
})();
