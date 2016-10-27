(function() {
  'use strict';
  angular
  .module('app')
  .factory('geoService', geoService);
  /**
	* station service: allows to get station of the day.
	*/
	function geoService($q,$window,$rootScope,
    webGeoCoding,
    logger) {
    /*
     * Public interface
     */
     var service = {};

     logger = logger.getLogger('Geocoding logic');
     service.getUserLocation = function(){
       var deferred = $q.defer();

       if (!$window.navigator) {
        $rootScope.$apply(function() {
          deferred.reject(new Error("Geolocation is not supported"));
        });
      } else {
        $window.navigator.geolocation.getCurrentPosition(function (position) {
          $rootScope.$apply(function() {
            deferred.resolve(position);
          });
        }, function (error) {
          $rootScope.$apply(function() {
            deferred.reject(error);
          });
        });
      }
      return deferred.promise;
    };
    service.distance = function(lat1, lon1, lat2, lon2, unit) {
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
    service.getReverseGeocode = function(lat, lon) {
     return webGeoCoding
     .getReverseGeocoding(lat, lon)
     .then(function(response) {
      if(response){
        if(response.features){
          if(response.features[0]){
            if(response.features[0].properties){
              return response.features[0].properties;
            }
          }
        }
      }
      return $q.reject();
    })
     .catch(function() {
      logger.log('error while trying to get reverse geocoding Data');
    });      
   };
   service.getGeocode = function(string) {
     return webGeoCoding
     .getLocation(string)
     .then(function(response) {
      if(response.data && response.data.features){
        return response.data.features;
      }else{
        return $q.reject();
      }
    })
     .catch(function() {
      logger.log('error while trying to get geocoding Data');
    });      
   };


   return service;
 }
})();
