angular.module('starter.controllers', ['ionic'])

    .controller('LoginCtrl', function ($scope) {
    })

    .controller('RegisterCtrl', function ($scope) {
    })

    .controller('ViewPatientsCtrl', function ($scope) {
    })

    .controller('PatientDetailsCtrl', function ($scope) {
    })

    .controller('SettingsCtrl', function ($scope) {
    })

    .controller('ChangePasswordCtrl', function ($scope) {
    })

    .controller('PopupCtrl', function ($scope, $ionicPopup, $timeout) {
        $scope.go = function (path) {
            $location.path(path);
        };
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
        $scope.showConfirmDeletePatient = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Patient',
                template: 'Are you sure you wish to delete this patient?'
            });

            confirmPopup.then(function(res) {
                if(res) {
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
        $scope.showConfirmDeleteAccount = function() {
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

            confirmPopup.then(function(res) {
                if(res) {
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
        $scope.showChangeNameAlert = function() {
            var alertPopup = $ionicPopup.alert({
                title: 'Username Changed'
            });

            alertPopup.then(function(res) {
                console.log('Username changed');
            });
        };
    });

;






