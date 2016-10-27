(function() {

  'use strict';

  angular
    .module('app')
    .directive('tabelement', tabelement);

  /**
   * Loading directive: displays a loading indicator while data is being loaded.
   *
   * Example usage: <div ui-loading="isLoading"></div>
   * The expected value of the directive attribute is a boolean indicating whether the content
   * is still loading or not.
   *
   * Additional parameter attributes:
   * - message: the loading message to display (none by default)
   *
   * Example: <div ui-loading="isLoading" message="Loading..."></div>
   */
  function tabelement() {
    return {
      restrict: 'A',
      templateUrl: 'modules/ui-components/tabElement/tabelement.html',
      scope: {
        stationName: '=name',
        stationDescription: '=description',
        stationFrequence: '=frequence',
        stationStart: '=start',
        stationFreeCar: '=car',
        stationFreeSpace: '=free'
      }
    };
  }

})();
