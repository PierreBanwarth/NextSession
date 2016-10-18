(function() {

  'use strict';

  angular
    .module('app')
    .factory('quoteService', quoteService);

  /**
   * Quote service: allows to get quote of the day.
   */
  function quoteService($q,
                        contextService,
                        restService) {
    /*
     * Constants
     */

    var ROUTES = {
      randomJoke: 'https://search.mapzen.com/v1/search'
    };

    /*
     * Public interface
     */

    var service = {};

    /**
     * Get a random Chuck Norris joke.
     * Used context properties:
     * - category: the joke's category: 'nerdy', 'explicit'...
     * @param {Object} context The context to use.
     * @return {Object} The promise.
     */
    service.getRandomJoke = function(context) {
      return restService
        .get(contextService.inject(ROUTES.randomJoke, context), null, true)
        .then(function(response) {
          if (response.data && response.data.value) {
            return response.data.value.joke;
          }
          return $q.reject();
        })
        .catch(function() {
          return 'Error, could not load joke :-(';
        });
    };

    return service;

  }

})();
