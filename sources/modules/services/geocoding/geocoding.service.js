(function() {
  'use strict';
  angular
  .module('app')
  .factory('geoService', geoService);
  /**
	* station service: allows to get station of the day.
	*/
	function geoService($q,
    webGeoCoding,
    logger) {
    /*
     * Public interface
     */
     var service = {};

     logger = logger.getLogger('Geocoding logic');
     
     service.getReverseGeocode = function(lat, lon) {
       return webGeoCoding
       .getReverseGeocoding(lat, lon)
       .then(function(response) {
        if(response && response.features && response.features[0].properties){
          return response.features[0].properties;
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
