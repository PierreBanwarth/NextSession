(function() {

  'use strict';

  angular
  .module('app')
  .controller('sessionController', ['$scope','$mdDialog','$q' ,'logger','sessionService','geoService','leafletBoundsHelpers','leafletMarkerEvents',
    function($scope, $mdDialog,$q, logger,sessionService, geoService,leafletBoundsHelpers, leafletMarkerEvents){
      logger = logger.getLogger('Session');
      /*
       * View model
       */
       var vm = this;
       vm.isOpen = false;
       $scope.events = {
        markers: {
          enable: leafletMarkerEvents.getAvailableEvents(),
        }
      };
      var markerEvents = leafletMarkerEvents.getAvailableEvents();
      for (var k in markerEvents){
        var eventName = 'leafletDirectiveMarker.' + markerEvents[k];
        $scope.$on(eventName, function(event, args){
          //$scope.eventDetected = event.name;
          if(event.name === 'leafletDirectiveMarker.click'){
             //$scope.showCustom(event);
             vm.setCurrentSession(args.model);
           }
         });
      }

      vm.isLoading = true;
      vm.currentSessionShow = false;
    //fix an error with not set center caused by leaflet

    vm.defaults= {
      zoomControlPosition: 'topright'
    };
    vm.selectedItem ;
    vm.places = [];
    vm.getUserLocation = function(){
      var deferred = $q.defer();
      geoService
      .getUserLocation()
      .then(function(geoData) {
        // we create a new marker and set center with user geolocation
        
        if(geoData){
          var marker = {
            lat: geoData.coords.latitude,
            lng: geoData.coords.longitude,
          }
          vm.setCenter(marker);
          deferred.resolve(marker);          
        }else{
          return deferred.reject('no user location');
        }
        
      });
      return deferred.promise;
    };
    vm.setCurrentSession = function(marker){
      vm.currentSession = marker;
      vm.currentSessionShow = true;
    }
    //function who take a marker and make the center of the map
    vm.setCenter = function(marker){
      // we need to set the center properties in order to display them on the bottom card.
      // but only if marker have a message or description is defined
      var zoom = 15;
      if(marker.message || marker.description){
        vm.setCurrentSession(marker);
        zoom = 18;
      }
      vm.center = {
        lat: marker.lat,
        lng: marker.lng,
        zoom: zoom
      };
    };
    // function used to show / hide the side nav
    vm.switch = function(){
      vm.isOpen = !vm.isOpen;
    };
    vm.getLocation = function(){
      if(vm.searchText !== '' && angular.isDefined(vm.searchText)){
        geoService
        .getGeocode(vm.searchText)
        .then(function(geoData) {
          vm.places = geoData;
        });  
      }
    }   
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
        if(geoData){
          if(geoData.country){
            $scope.country = geoData.country;
          }if(geoData.country_a){
            $scope.country_a = geoData.country_a;
          }if(geoData.county){
            $scope.county = geoData.county;
          }if(geoData.label){
            $scope.label = geoData.label;
          }if(geoData.street){
            $scope.street = geoData.street;
          }if(geoData.locality){
            $scope.locality = geoData.locality;
          }if(geoData.localadmin){
            $scope.localadmin = geoData.localadmin;
          }if(geoData.macrocounty){
            $scope.macrocounty = geoData.macrocounty;
          }if(geoData.macroregion){
            $scope.macroregion = geoData.macroregion;
          }if(geoData.name){
            $scope.name = geoData.name;
          }if(geoData.region){
            $scope.region = geoData.region;
          }          
        }
      }).finally(function() {
        $mdDialog.show({
          clickOutsideToClose: true,
          scope: $scope,        
          preserveScope: true,           
          templateUrl: 'modules/screens/session/modale.tpl.html',
          parent: angular.element(document.body),
          controller: function DialogController($scope, $mdDialog ,geoService) {
            var vm2 = this;
            $scope.closeDialog = function() {
              $mdDialog.hide();
            }
            $scope.validDialog = function(){
            // need to validate input by user
            if($scope.description && $scope.place && $scope.freq && $scope.start){
              sessionService.addSessions( $scope.place,$scope.description, $scope.freq , $scope.start ,event.latlng.lat, event.latlng.lng);
              $mdDialog.hide();
              $scope
              $scope.description = '';
              $scope.place ='';
              $scope.freq = '';
              $scope.start = '';
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
  vm.remove = function(){
    sessionService
    .removeSession(vm.currentSession)
    .then(function(dataSession) {
      $scope.dataSession = dataSession;
    });
    vm.currentSessionShow = false;
    vm.init();
  };
   //function who get session from firebase
   vm.update= function(){
    sessionService
    .getSessions(vm.userLocation)
    .then(function(dataSession) {
      $scope.dataSession = dataSession;
    });
    $scope.markers = sessionService.getMarkers();
  };

  vm.init = function() {
    logger.log('init sessions');
    vm.center = {
      lat: 45.188616,
      lng: 5.725969,
      zoom: 1
    };
    vm.getUserLocation().then(function(userLocation){
      vm.userLocation = userLocation;
      sessionService
      .getSessions(vm.userLocation)
      .then(function(dataSession) {
        $scope.dataSession = dataSession;
      }).finally(function() {
        vm.isLoading = false;

      });
      $scope.markers = sessionService.getMarkers();
    })
  };
  vm.init();
}
]);
})
();
//