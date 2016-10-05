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
						restService) {
	/*
    * Constants
    */
    var ROUTES = {
		allStation: ''
    };
	/*
    * Public interface
    */
    var service = {};
     /**
     * Get all station items
     */
    service.getAllStation = function() {
      return restService
        .get(ROUTES.allStation, null, true)
        .then(function(response) {
          if (response.data) {
            console.log(response);
            return response.data;

          }
          return $q.reject();
        })
        .catch(function() {
          return 'Error, could not load stations';
        });
    };
    return service;
  }
})();
