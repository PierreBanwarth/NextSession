(function() {

  'use strict';

  angular
  .module('app')
  .factory('webSessionService', webSessionService);
  /**
   * session service: allows to get session of the day.
   */
   function webSessionService($q,
    $firebaseObject,
    restService) {
    /*
     * Constants
     */

     var config = {
      apiKey: '',
      authDomain: '',
      databaseURL: 'https://dazzling-fire-3293.firebaseio.com/',
      storageBucket: ''
    };
    firebase.initializeApp(config);
    var ref = firebase.database().ref();
    // download the data into a local object
    var data;
    /*
     * Public interface
     */
     var service = {};
     /* Get a random Chuck Norris joke.
     * Used context properties:
     * - category: the joke's category: 'nerdy', 'explicit'...
     * @param {Object} context The context to use.
     * @return {Object} The promise.
     */
     service.addSession = function(session) {
      return ref.child('features')
      .push(session)
      .then(function(response){
        if(response){
          return reponse;
        }
        return $q.reject();
      })
      .catch(function(){
        return 'Error, could not add session';
      });
    };
      
    service.getSessions = function(context) {
      data = $firebaseObject(ref.child('features'));      
      return data.$loaded()
      .then(function(response) {
        if (response) {
          return response;
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
