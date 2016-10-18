(function() {

  'use strict';

  angular
  .module('app')
  .controller('sessionController', ['$scope','$mdDialog' ,'logger','sessionService','geoService','leafletBoundsHelpers',
    function($scope, $mdDialog, logger,sessionService, geoService,leafletBoundsHelpers){

      logger = logger.getLogger('Session');
      /*
       * View model
       */
       var vm = this;
       vm.isOpen = false;
       $scope.events = {};
       vm.isLoading = true;
       
       $scope.selectedUser = { id: 1, name: 'Bob' };
    //fix an error with not set center caused by leaflet
    vm.center = {
      lat: 45.188616,
      lng: 5.725969,
      zoom: 1
    };
    vm.defaults= {
      zoomControlPosition: 'topright'
    };
    vm.selectedItem ;
    vm.places = [];

    //function who take a marker and make the center of the map
    vm.setCenter = function(marker){
      vm.center = {
        lat: marker.lat,
        lng: marker.lng,
        zoom: 18
      };
    };
    // function used to show / hide the side nav
    vm.switch = function(){
      vm.isOpen = !vm.isOpen;
    };
    // work in progress in order to give revert geocoding tool bar
    vm.getLocation = function(){
      if(vm.searchText !== '' && angular.isDefined(vm.searchText)){
        geoService
        .getGeocode(vm.searchText)
        .then(function(geoData) {
          vm.places = geoData;
        });  
      }
      
    }   
    // end of work in progress

    //Selected update function when user select a geographical zone with the revert geocoding search bar
    // the map is centerd on the border box of the zone
    // if the zone avec a border box then use it else use center.
    vm.selectedUpdate = function(){
      // if the selected item have a bbox attributes
      if( angular.isDefined(vm.selectedItem.bbox)){
        vm.bounds = leafletBoundsHelpers.createBoundsFromArray([
          [ vm.selectedItem.bbox[1] , vm.selectedItem.bbox[0] ],
          [ vm.selectedItem.bbox[3] , vm.selectedItem.bbox[2] ]
          ]);        
      // else selected item is to small to have a bbox and we need to use center properties
    }else{
      vm.center = {
        lat: vm.selectedItem.geometry.coordinates[1],
        lng: vm.selectedItem.geometry.coordinates[0],
        zoom: 18
      };
    }
  };     
    // Function who display the modale to add a session on the map
    // TODO need to extract to an external file the modale controller
    $scope.showCustom = function(event) {
      geoService
      .getReverseGeocode(event.latlng.lat, event.latlng.lng)
      .then(function(geoData) {
        $scope.cleanScope();
        $scope.country = geoData.country;
        $scope.country_a = geoData.country_a;
        $scope.county = geoData.county;
        $scope.label = geoData.label;
        $scope.street = geoData.street;
        $scope.locality = geoData.locality;
        $scope.localadmin = geoData.localadmin;
        $scope.macrocounty = geoData.macrocounty;
        $scope.macroregion = geoData.macroregion;
        $scope.name = geoData.name;
        $scope.region = geoData.region;
      }) .finally(function() {
        $mdDialog.show({
          clickOutsideToClose: true,
          scope: $scope,        
          preserveScope: true,           
          templateUrl: 'modules/screens/session/modale.tpl.html',
          parent: angular.element(document.body),
          controller: function DialogController($scope, $mdDialog,geoService) {
            var vm2 = this;
            $scope.closeDialog = function() {
              $mdDialog.hide();
            }
            $scope.validDialog = function(){
          // need to validate input by user
          if($scope.description && $scope.place){
            sessionService.addSessions( $scope.place,$scope.description, event.latlng.lat, event.latlng.lng);
            $mdDialog.hide();
            $scope.description = '';
            $scope.place ='';
            vm.update();
          }
        }
        // when clicking on map we fill all variable to display the city.
      }
    });
      });
    };

   // function who show dialog to add a new session
   $scope.cleanScope = function(){
    $scope.country = '';
    $scope.country_a = '';
    $scope.county = '';
    $scope.label = '';
    $scope.street = '';
    $scope.locality = '';
    $scope.localadmin = '';
    $scope.macrocounty =''; 
    $scope.macroregion = '';
    $scope.name = '';
    $scope.region = '';
  }
  $scope.$on("leafletDirectiveMap.click", function(event, args){
    var leafEvent = args.leafletEvent;
    $scope.showCustom(leafEvent);
    // need to send new session to database
  });
   //function who get session from firebase
   vm.update= function(){
    sessionService
    .getSessions()
    .then(function(dataSession) {
      $scope.dataSession = dataSession;
    });
    $scope.markers = sessionService.getMarkers();
  };

  vm.init = function() { 
    logger.log('init sessions');
    vm.getLocation();
    sessionService
    .getSessions()
    .then(function(dataSession) {
      $scope.dataSession = dataSession;
    }).finally(function() {
      vm.isLoading = false;
    });
    $scope.markers = sessionService.getMarkers();
  };
  vm.init();
}
]);
})
();
//