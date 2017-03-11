angular.module('starter.controllers', ['ionic'])

    .controller('LoginCtrl', function ($scope, $http, $rootScope, $window) {
        $scope.getDetails = function () {
            $http.get('http://patienttrackapiv2.azurewebsites.net/api/Carers/' + this.loginEmail + '/' + this.loginPwd)
                .success(function (data, status, headers, config) {
                    console.log('data success');
                    console.log(data); // for browser console
                    $rootScope.carers = data; // for UI
                    $window.location.href = '#/ViewPatients';
                })
                .error(function (data, status, headers, config) {
                    $scope.showLoginFail();
                    console.log('data error');
                });
        };
    })

    .controller('RegisterCtrl', function ($scope) {

    })

    .controller('ViewPatientsCtrl', function ($scope, $http, $rootScope, $window) {
        $scope.viewPatient = function (index) {
            $window.location.href = '#/PatientDetails'
            angular.element(document).ready(function () {
                $rootScope.selectedPatient = $rootScope.carers.Patients[index];
                var lat = $rootScope.carers.Patients[index].Locations[$rootScope.carers.Patients[index].Locations.length - 1].Latitude;
                var long = $rootScope.carers.Patients[index].Locations[$rootScope.carers.Patients[index].Locations.length - 1].Longitude;
                console.log("Lat is " + lat + ", Long is " + long);
                var latLng = new google.maps.LatLng(lat, long);
                var mapOptions = {
                    center: latLng,
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

                // Wait until the map is loaded
                google.maps.event.addListenerOnce($scope.map, 'idle', function () {

                    var marker = new google.maps.Marker({
                        map: $scope.map,
                        animation: google.maps.Animation.DROP,
                        position: latLng
                    });
                });
            });
        }
    })

    .controller('PatientDetailsCtrl', function ($scope) {
    })

    .controller('SettingsCtrl', function ($scope) {
    })

    .controller('ChangePasswordCtrl', function ($scope) {
    })


    .controller('CarerController', function ($scope, $rootScope, $http, $window) {
        // $scope.getDetails = function (id) {
        //     $http.get('http://patienttrackapiv2.azurewebsites.net/api/Carers/' + id)
        //         .success(function (data, status, headers, config) {
        //             console.log('data success');
        //             console.log(data); // for browser console
        //             $rootScope.carers = data; // for UI
        //             $window.location.href = '#/ViewPatients';
        //         })
        //         .error(function (data, status, headers, config) {
        //             console.log('data error');
        //         });
        // };

        // $scope.viewPatient = function (index, $timeout) {
        //     $window.location.href = '#/PatientDetails'
        //     angular.element(document).ready(function () {
        //         $rootScope.selectedPatient = $rootScope.carers.Patients[index];
        //         var lat = $rootScope.carers.Patients[index].Locations[$rootScope.carers.Patients[index].Locations.length - 1].Latitude;
        //         var long = $rootScope.carers.Patients[index].Locations[$rootScope.carers.Patients[index].Locations.length - 1].Longitude;
        //         console.log("Lat is " + lat + ", Long is " + long);
        //         var latLng = new google.maps.LatLng(lat, long);
        //         var mapOptions = {
        //             center: latLng,
        //             zoom: 15,
        //             mapTypeId: google.maps.MapTypeId.ROADMAP
        //         };
        //         $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        //
        //         // Wait until the map is loaded
        //         google.maps.event.addListenerOnce($scope.map, 'idle', function () {
        //
        //             var marker = new google.maps.Marker({
        //                 map: $scope.map,
        //                 animation: google.maps.Animation.DROP,
        //                 position: latLng
        //             });
        //         });
        //     });
        // }
    })

    .controller('PopupCtrl', function ($scope, $ionicPopup, $timeout) {

        // Triggered on a button click, or some other target
        $scope.showAddPopup = function () {
            $scope.data = {};

            // Popup for adding a new patient
            var myPopup = $ionicPopup.show({
                /* add 'ng-model="data.patient"' to the template once data type created */
                template: '<input type="text">',
                title: 'Enter Patient Code',
                subTitle: 'This is found in the patient\'s app',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel',
                        type: 'button-calm'
                    },
                    {
                        text: '<b>Add</b>',
                        type: 'button-balanced',
                        // onTap: function (e) {
                        //     if (!$scope.data.patient) {
                        //         //don't allow the user to close unless he enters patient's code
                        //         e.preventDefault();
                        //     } else {
                        //         return $scope.data.patient;
                        //     }
                        // }
                    }
                ]
            });

            myPopup.then(function (res) {
                console.log('Tapped!', res);
            });

            $timeout(function () {
                myPopup.close(); //close the popup after 10 seconds to avoid accidents
            }, 10000);
        };

        // A confirm dialog for deleting a patient
        $scope.showConfirmDeletePatient = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Patient',
                template: 'Are you sure you wish to delete this patient?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    console.log('Confirmed');
                } else {
                    console.log('Cancelled');
                }
            });

            $timeout(function () {
                confirmPopup.close(); //close the popup after 10 seconds to avoid accidents
            }, 10000);
        };

        // A confirm dialog for deleting a patient
        $scope.showConfirmDeleteAccount = function () {
            var confirmPopup = $ionicPopup.show({
                template: '<input type="password">',
                title: 'Delete Account',
                subTitle: 'Enter your password to confirm',
                scope: $scope,
                buttons: [
                    {
                        text: 'Cancel',
                        type: 'button-calm'
                    },
                    {
                        text: '<b>Delete</b>',
                        type: 'button-assertive',
                        // onTap: function (e) {
                        // // delete carer
                        // }
                    }
                ]
            });

            confirmPopup.then(function (res) {
                if (res) {
                    console.log('Confirmed');
                } else {
                    console.log('Cancelled');
                }
            });

            $timeout(function () {
                confirmPopup.close(); //close the popup after 10 seconds to avoid accidents
            }, 10000);
        };

        // An alert dialog
        $scope.showChangeNameAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Username Changed'
            });

            alertPopup.then(function (res) {
                console.log('Username changed');
            });
        };

        // An alert dialog
        $scope.showLoginFail = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Details not found',
                subTitle: 'Please check your credentials'
            });

            alertPopup.then(function (res) {
                console.log('Login attempt failed');
            });
        };
    });






