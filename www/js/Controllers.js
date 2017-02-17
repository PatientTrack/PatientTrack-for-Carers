angular.module('starter.controllers', ['ionic'])

    .controller('LoginCtrl', function ($scope) {
    })

    .controller('RegisterCtrl', function ($scope) {
    })

    .controller('ViewPatientsCtrl', function ($scope) {
    })

    .controller('PopupCtrl',function($scope, $ionicPopup, $timeout) {
        $scope.go = function ( path ) {
            $location.path( path );
        };});






