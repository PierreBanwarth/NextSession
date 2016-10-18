(function() {
  'use strict';
  angular
  .module('app')
  .factory('geoService', geoService);
  /**
	* station service: allows to get station of the day.
	*/
	function geoService($q,
    webGeoService,
    logger) {
    /*
     * Public interface
     */
     var service = {};

     logger = logger.getLogger('Geocoding logic');
     
     service.getGeocode = function(string) {
       return webGeoService
       .getlocation(string)
       .then(function(response) {
        if(response.data && response.data.features){
          return response.data.features;
        }else{
          return $q.reject();
        }
      })
       .catch(function() {
        logger.log('error while trying to get geoData');
      });      
     };


     return service;
   }
 })();
