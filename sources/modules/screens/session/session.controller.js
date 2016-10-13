(function() {

  'use strict';

  angular
  .module('app')
  .controller('sessionController', ['$scope','$mdDialog' ,'logger','sessionService',
    function($scope,$mdDialog, logger,sessionService){

      logger = logger.getLogger('home');
      /*
       * View model
       */
       $scope.events = {};
       $scope.isLoading = true;
       $scope.quote = null;
    //fix an error with not set center caused by leaflet
    $scope.center = {
      lat: 45.188616,
      lng: 5.725969,
      zoom: 1
    };
    $scope.defaults= {
      zoomControlPosition: 'topright'
    };
    


    $scope.showCustom = function(event) {
     $mdDialog.show({
      clickOutsideToClose: true,
      scope: $scope,        
      preserveScope: true,           
      templateUrl: 'modules/screens/session/modale.tpl.html',
      parent: angular.element(document.body),
      controller: function DialogController($scope, $mdDialog) {
        $scope.closeDialog = function() {
          $mdDialog.hide();
        }
        $scope.validDialog = function(){
          // need to validate input by user
          console.log(event);
          sessionService.addSessions($scope.description, $scope.place, event.latlng.lat, event.latlng.lng);
          $mdDialog.hide();
          $scope.description = '';
          $scope.place ='';
          $scope.update();

        }
      }
    });
   };
   $scope.$on("leafletDirectiveMap.click", function(event, args){
    var leafEvent = args.leafletEvent;
    $scope.showCustom(leafEvent);
    // need to send new session to database
  });
   $scope.update= function(){
    sessionService
    .getSessions()
    .then(function(dataSession) {
      $scope.dataSession = dataSession;
    });
    $scope.markers = sessionService.getMarkers();
  }
  $scope.init = function() { 

    logger.log('init sessions');
    sessionService
    .getSessions()
    .then(function(dataSession) {
      $scope.dataSession = dataSession;
    }).finally(function() {
      $scope.isLoading = false;
    });
    $scope.markers = sessionService.getMarkers();
  };
  $scope.init();
}
])
})
();
