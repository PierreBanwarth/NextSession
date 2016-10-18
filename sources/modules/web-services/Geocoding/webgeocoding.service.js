(function() {

  'use strict';

  angular
  .module('app')
  .factory('webGeoCoding', webGeoCoding);

  /**
   * Quote service: allows to get quote of the day.
   */
   function webGeoCoding($q,
    restService) {
    /*
     * Constants
     */

     var ROUTES = {
      search: 'https://search.mapzen.com/v1/search',
      reverse: 'https://search.mapzen.com/v1/reverse'
    };

    /*
     * Public interface
     */
     var round = function(value, decimals) {
      return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }

    var service = {};
     // work in progress when you click on the map fill the input with adress etc
     service.getReverseGeocoding = function(lati, long) {
      var params = [];
      lati = round(lati,6);
      long = round(long,6);
      params['api_key'] ='mapzen-ch8t7iL';
      params['point.lon'] = long,
      params['point.lat'] = lati,


      console.log('https://search.mapzen.com/v1/reverse?api_key=mapzen-ch8t7iL'+'&point.lon='+long+'&point.lat='+lati);
      return restService
      .get(ROUTES.reverse, params,'force', true)
      .then(function(response) {
        if (response) {
          return response.data;
        }
        return $q.reject();
      })
      .catch(function() {
        return 'Error, could not load reverse geocoding Data';
      });
    };

     // end of work in progress

    /**
     * Get a list of place to help user finding their session 
     * Used string propertie:
     * - string: the input string given by user
     * @param {Object} context The context to use.
     * @return {Object} The promise.
     */
     service.getLocation = function(string) {
      var params = [];
      params['text'] = string;
      params['api_key'] ='mapzen-ch8t7iL';
      /*var params = {
        'text' : 'London, UK',
        'api_key' : 'mapzen-ch8t7iL'
      };*/
      return restService
      .get(ROUTES.search, params,'force', true)
      .then(function(response) {
        if (response) {
          return response;
        }
        return $q.reject();
      })
      .catch(function() {
        return 'Error, could not load geographical data';
      });
    };

    return service;
  }
})();
