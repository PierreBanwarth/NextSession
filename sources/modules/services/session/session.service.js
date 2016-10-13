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

     logger = logger.getLogger('Session logic');
     
     service.addSessions = function(place, description, lat , lng) {
      var marker = {
        lat: lat,
        lng: lng,
        focus: false,
        message: description,
            // + ' ' + availableCar + '/' + totalCar,
            draggable: false,
          };
          markers.push(marker);
          /*if (markers && angular.isDefined(markers)) {
            return markers;              
          }*/
          var coord = {
            coordinates : [lng,lat,0]
          }
          var marker = {
            geometry : coord,
            properties : {
              description : description,
              name : place
            }
          };
          console.log(marker);
          return webSessionService
          .addSession(marker).then(function(response){
              logger.log('Adding new session');
          });
          
        };
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
      angular.forEach( dataSession, function(value, key){
        var marker = {
          lat: value.geometry.coordinates[1],
          lng: value.geometry.coordinates[0],
          focus: false,
          message: value.properties.name,
            // + ' ' + availableCar + '/' + totalCar,
            draggable: false,
          };
          markers.push(marker);

        });
    };
    return service;
  }
})();
