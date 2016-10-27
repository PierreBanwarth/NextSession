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
     var userLocationLocal
     logger = logger.getLogger('Session logic');


     service.addSessions = function(place, description,freq,start, lat , lng) {
      var marker = {
        lat: lat,
        lng: lng,
        focus: false,
        message: description,
        frequence: freq,
        start: start,
        // + ' ' + availableCar + '/' + totalCar,
        draggable: false,
      };
      markers.push(marker);
      /*if (markers && angular.isDefined(markers)) {
        return markers;              
      }*/
      var coord = {
        coordinates : [lng,lat,0]
      };
      var marker = {
        geometry : coord,
        properties : {
          description : description,
          name : place,
          frequence : freq,
          start : start
        }
      };
      return webSessionService
      .addSession(marker).then(function(response){
        logger.log('Adding new session');
      });
    };
    // we need userLoocation in order to sort session by distance between user and session place
    service.getSessions = function(userLocation) {
      markers = [];
      return webSessionService
      .getSessions()
      .then(function(response) {
        dataSession = response;
        dataMerge(userLocation);
        return dataSession;
      })
      .catch(function() {
        logger.log('error while trying to get dataSession');
      });      
    };
    service.removeSession = function(session){
      console.log(session)
      return webSessionService
      .removeSession(session)
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
    var dataMerge = function(userLocation) {

      var sessions = dataSession;
      angular.forEach( dataSession, function(value, key){
        var marker = {
          lat: value.geometry.coordinates[1],
          lng: value.geometry.coordinates[0],
          focus: false,
          message: value.properties.name,
          description: value.properties.description,
          frequence: value.properties.description,
          start: value.properties.start,
            // + ' ' + availableCar + '/' + totalCar,
            draggable: false,
          };
          markers.push(marker);
        });

      markers.sort(function(marker1, marker2){
        if(userLocation && marker1 && marker2){
          return distance(userLocation.lat, userLocation.lng, marker1.lat, marker1.lng,'K') 
          - distance(userLocation.lat, userLocation.lng, marker2.lat, marker2.lng,'K');  
        }else{
          return -1;
        }
      });
    };
    var distance = function(lat1, lon1, lat2, lon2, unit) {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344; }
      if (unit=="N") { dist = dist * 0.8684; }
      return dist;
    }
    return service;
  }
})();
