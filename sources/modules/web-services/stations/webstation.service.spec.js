'use strict';

/*
 * Tests for quote service.
 */
describe('webStationService', function() {

  // Constants
  var ERROR_STATION = 'Error, could not load stations';

  var $q;
  var $rootScope;
  var restService;
  var webStationService;
  var logger;

  beforeEach(function() {
    module('app');

    inject(function(_$q_,
                    _$rootScope_,
                    _webStationService_,
                    _restService_,
                    _logger_
                    ) {

      $q = _$q_;
      $rootScope = _$rootScope_;
      webStationService = _webStationService_;
      restService = _restService_;
      logger = _logger_;
    });

  });

  it('should have a getAllStation method', function() {
    expect(typeof (webStationService.getAllStation)).toBe('function');
  });
  it('should have a getDataStation method', function() {
    expect(typeof (webStationService.getDataStation)).toBe('function');
  });
  describe('getDataStation',function(){
    it('should call rest service get method and return Data', function(done){
      //Prepare
        spyOn(restService, 'get').and.callFake(function(){
          var deferred = $q.defer();
          deferred.resolve({
            data: JSON.stringify('hello')
          });
          return deferred.promise;
        });
      //Act
      var promise = webStationService.getDataStation();
      //Asset
      promise.then(function(station){
        expect(restService.get).toHaveBeenCalled();
        expect(station).toEqual('hello');
        done();
      });
    
    $rootScope.$apply();
    });
  });
  describe('getAllStation', function() {

   it('should call rest service get method and return joke', function(done) {
      // Prepare
      spyOn(restService, 'get').and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve({
          data: 'hello'
        });
        return deferred.promise;
      });

      // Act
      var promise = webStationService.getAllStation();

      // Assert
      promise.then(function(station) {
        expect(restService.get).toHaveBeenCalled();
        expect(station).toEqual('hello');
        done();
      });

      $rootScope.$apply();
    });

    it('should call rest service get method and fail when there is no stations in the response', function(done) {
      // Prepare
      spyOn(restService, 'get').and.callFake(function() {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
      });
      var observerSpy = jasmine.createSpy('observerSpy');
      // Act
      logger.addObserver(observerSpy);
      logger = logger.getLogger();
      // Act
      var promise = webStationService.getAllStation();

      // Assert
      promise.then(function() {
        expect(restService.get).toHaveBeenCalled();
        expect(observerSpy).toHaveBeenCalledWith(ERROR_STATION, 'webStationService', 'log', undefined );
        done();
      });

      $rootScope.$apply();
    });

    it('should call rest service get method and fail to get a response', function(done) {
      // Prepare
      spyOn(restService, 'get').and.callFake(function() {
        return $q.reject({});
      });
      var observerSpy = jasmine.createSpy('observerSpy');
      // Act
      logger.addObserver(observerSpy);
      logger = logger.getLogger();
      // Act
      var promise = webStationService.getAllStation();

      // Assert
      promise.then(function() {
        expect(restService.get).toHaveBeenCalled();
        expect(observerSpy).toHaveBeenCalledWith(ERROR_STATION, 'webStationService', 'log', undefined );
        done();
      });
      $rootScope.$apply();
    });

  });

});
