/**
 * Created by Saurabh on 16-Aug-15.
 */
//  Edited By :Anurag Anand 
// Thrid party changes
var appModule = angular.module('thrillophilia',['ionic','services.underscore','directives.compileTemplate']);

appModule.config(['$stateProvider','$urlRouterProvider','$ionicConfigProvider','$httpProvider',function($stateProvider, $urlRouterProvider,$ionicConfigProvider,$httpProvider) {

    //Route Configurations
    $stateProvider
        .state('landing',{
            url:'/landing_pages',
            templateUrl:'app/landingPages/views/landing-page.tpl.html'
        })
        .state('details',{
            url:'/landing_page/:id',
            templateUrl:'app/landingPages/views/landing-page-details.tpl.html',
            controller:'LandingPageCtrl',
            cache:false
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/landing_pages');

    //Ionic Configurations
    $ionicConfigProvider.tabs.position("top");
    $ionicConfigProvider.tabs.style('striped');
    $ionicConfigProvider.backButton.previousTitleText(false);

    /*
       Request Interceptors.
       Here place the code to be done before an API call is made to the server
       and after server responds
     */
    $httpProvider.interceptors.push(function ($rootScope, $q) {
        return {
            request: function (config) {
                //If Request is not silent then show loading screen
                if (!config.silent) {
                    $rootScope.$broadcast('loading:show');
                }
                //Other code before an API call
                return config;
            },
            response: function (response) {
                //Things to do after server responds successfully
                $rootScope.$broadcast('loading:hide');
                return response;
            },
            requestError: function (request) {
                $rootScope.$broadcast('loading:hide');
                return request;
            },
            responseError: function (response) {
                //Things to do after server responds with an error
                $rootScope.$broadcast('loading:hide');
                return $q.reject(response);
            }
        };
    });

}]);

appModule.run(['$ionicPlatform','$rootScope','$ionicLoading','$state','$ionicHistory',function($ionicPlatform,$rootScope,$ionicLoading,$state,$ionicHistory) {

    //Mobile Configurations
    ionic.Platform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
    });

    $ionicPlatform.registerBackButtonAction(function(e) {
        alert("back button tapped");
        if($ionicHistory.backView()) {
            // there is a back view, go to it
            var currentState = $ionicHistory.currentStateName();
            if(currentState == 'landing') {
                ionic.Platform.exitApp();
            } else {
                $ionicHistory.goBack();
            }
        } else {
            // there is no back view, so close the app instead
            ionic.Platform.exitApp();
        }
        e.preventDefault();
        return false;
    },110);


    //Listener for show loading event call
    $rootScope.$on('loading:show', function() {
        $ionicLoading.show({
            template: 'Loading',
            hideOnStateChange:true
        })
    });

    //Listener for hide loading event call
    $rootScope.$on('loading:hide', function() {
        $ionicLoading.hide()
    });
}]);

/**
 * nddoc controller
 *
 * @description
 * Main Application Controller
 *
 * This controller holds actions for loading the landing page after fetching the details from server
 * Also for redirecting to details of the landing page
 */
appModule.controller('AppCtrl',['$scope','$state','landingPageService','$ionicPlatform',function($scope,$state,landingPageService,$ionicPlatform) {

    var page = 0;
    $scope.loadMore = true;

    /**
     * @ngdoc Action
     *
     * @description
     * Action to fetch landing page list and render it on the screen
     * This action occurs on state load and when user scrolls beyond the end of the screen
     */
    $scope.loadLandingPageList = function() {
        landingPageService.getLandingPageList(++page)
            .then(function(data) {
                $scope.landingPageList = data.landing_pages;
                if(page === data.total_pages) {
                    $scope.loadMore = false;
                    page = 0;
                }
            })
            .catch(function(error) {
                window.plugins.toast.showLongBottom(error);
            })
            .finally(function(){
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.$broadcast('scroll.refreshComplete');
            })
    };

    /**
     * @ngdoc Action
     *
     * @description
     * Action to refresh the landing page list
     * This action occurs when user pull the list representing 'Pull to Refresh' functionality
     */
    $scope.refreshList = function() {
        $scope.loadMore = true;
        page = 0;
        $scope.loadLandingPageList();
    };

    /**
     * @ngdoc Action
     *
     * @description
     * Action to show the landing page details
     * This action occurs when user taps on a landing page card
     *
     * @param landingPageId {Number=} Id of the landing page
     */
    $scope.showLandingPage = function(landingPageId) {
        $state.go('details',{id:landingPageId});
    }

}]);