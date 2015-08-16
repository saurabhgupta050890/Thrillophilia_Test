/**
 * Created by Saurabh on 7/1/14.
 *
 * @ngdoc service
 *
 * @description
 *  This services is a small wrapper to use underscoreJs with angular.
 *  Inject this service to use methods of underscore directly in angular.
 *  Make sure to load underscore.js before underscoreService file.
 **/

angular.module('services.underscore',[])
    .factory('_',function() {
        return window._;    //underscoreJs must be already loaded. So include this service after loading underscore file.
    });