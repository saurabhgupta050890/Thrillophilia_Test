/**
 * Created by Saurabh on 16-Aug-15.
 *
 * @ngdoc service
 *
 * @description
 * Service to fetch landing pages list and landing page details
 */

appModule.factory('landingPageService',['$http','$q',function($http,$q) {
    var baseURL = 'https://staging-api.thrillophilia.com/api/v1/consumers/landing_pages/';
    var CLIENT_ID = '135';
    var AUTH_TOKEN = '1fqk64sPFfiyPTsc8sEx';

    var defaultParams = {
        auth_token:AUTH_TOKEN,
        client_id:CLIENT_ID
    };

    var landingPageService = {};

    /**
     * Method to fetch the the list of landing pages
     * @param page page number in case of pagination
     * @returns {*} promise which resolves to an array of landing pages
     */
    landingPageService.getLandingPageList = function (page) {
        var params = angular.copy(defaultParams);
        if(page) {
            angular.extend(params,{page_number:page});
        }

        var deferred = $q.defer();

        $http.get(baseURL,{params:params})
            .then(function(response) {
                deferred.resolve(response.data)
            })
            .catch(function(errorResponse) {
                if(errorResponse.statusCode === 404) {
                    deferred.reject("Resource Not Found");
                } else {
                    var error = errorResponse.data;
                    deferred.reject(error.message || "Error while fetching data. Please Try again !!");
                }
            });
        
        return deferred.promise;
    };

    /**
     * Method to fetch details of a particular landing page
     * @param id Id of the landing page whose details needs to be fetched
     * @returns {*} promise which resolves to an object containing details of landing page. This also have two arrays for content_tours and cards
     */
    landingPageService.getLandingPageDetails = function (id) {
        var params = angular.copy(defaultParams);
        var deferred = $q.defer();

        $http.get(baseURL + id,{params:params})
            .then(function(response) {
                deferred.resolve(response.data)
            })
            .catch(function(errorResponse) {
                if(errorResponse.statusCode === 404) {
                    deferred.reject("Resource Not Found");
                } else {
                    var error = errorResponse.data;
                    deferred.reject(error.message || "Error while fetching data. Please Try again !!");
                }
            });

        return deferred.promise;
    };

    return landingPageService;
}]);
