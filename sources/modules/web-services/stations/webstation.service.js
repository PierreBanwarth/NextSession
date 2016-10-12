(function() {
	'use strict';
	angular
	.module('app')
	.factory('webStationService', webStationService);
	/**
	* station service: allows to get station of the day.
	*/
	function webStationService($q,
    logger,
    restService) {
						/*
						* Constants
						*/
						var ROUTES = {
							allStation: 'http://www.metromobilite.fr/data/Carto/Statique/ListeDesStationsOMMS.json',
							dataStation: 'http://www.metromobilite.fr/data/Carto/Dynamique/dynDetailDesVehiculesOMMS.json'
						};
						/*
    					* Public interface
    					*/
              var service = {};
              logger = logger.getLogger('webStationService');
     /**
     * Get all station items
     */
     service.getAllStation = function() {
      return restService
      .get(ROUTES.allStation, null, true)
      .then(function(response) {
        if (response.data) {
          return response.data;
        }
        return $q.reject();
      })
      .catch(function() {
       logger.log('Error, could not load stations');
     });
    };
    service.getDataStation = function() {
      return restService
      .get(ROUTES.dataStation, null, true)
      .then(function(response) {
       if (response.data) {
        var result = [];
        result =  angular.fromJson(response.data);
        return result;
      }
      return $q.reject();
    })
      .catch(function() {
       logger.log('Error, could not load stations');
     });
    };
    return service;
  }
})();
