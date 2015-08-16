/**
 * Created by Saurabh on 16-Aug-15.
 */

appModule.controller('LandingPageCtrl',['$scope','$stateParams','landingPageService','_',function($scope,$stateParams,landingPageService,_) {

    var landingPageId = $stateParams.id; //Id of the landing page
    $scope.tours = [];
    $scope.activities = [];
    landingPageService.getLandingPageDetails(landingPageId)
        .then(function(data) {
            $scope.tours = data.content_tours || [];
            $scope.activities = _.uniq(data.cards,function(item){return item.id}) || [];  //List from Server should not contain items with same id
        })
        .catch(function(error) {
            window.plugins.toast.showLongBottom(error);
        });
}]);