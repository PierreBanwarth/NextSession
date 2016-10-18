(function() {

  'use strict';

  angular
  .module('app')
  .factory('webGeoService', webGeoService);

  /**
   * Quote service: allows to get quote of the day.
   */
   function webGeoService($q,
    restService) {
    /*
     * Constants
     */

     var ROUTES = {
      apiRoute: 'https://search.mapzen.com/v1/search'
    };

    /*
     * Public interface
     */

     var service = {};

    /**
     * Get a list of place to help user finding their session 
     * Used string propertie:
     * - string: the input string given by user
     * @param {Object} context The context to use.
     * @return {Object} The promise.
     */
     service.getlocation = function(string) {
      var params = [];
      params['text'] = string;
      params['api_key'] ='search-EEgHGcM';
      /*var params = {
        'text' : 'London, UK',
        'api_key' : 'search-EEgHGcM'
      };*/
      return restService
      .get(ROUTES.apiRoute, params,'force', true)
      .then(function(response) {
        if (response) {
          return response;
        }
        return $q.reject();
      })
      .catch(function() {
        return 'Error, could not load geoData';
      });
    };

    return service;

  }

})();
