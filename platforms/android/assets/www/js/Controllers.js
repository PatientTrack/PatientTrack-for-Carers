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
                });
        };
    })

    .controller('RegisterCtrl', function ($scope, $http, $window) {
        $scope.registerCarer = function () {
            var data =
                {
                    "Patients": [],
                    "CarerFName": this.regUsername,
                    "CarerEmail": this.regEmail,
                    "CarerPwd": this.regPwd
                };
            $http.post('http://patienttrackapiv2.azurewebsites.net/api/Carers/', data)
                .success(function (data, status, headers, config) {
                    console.log('Registered successfully');
                    $scope.showRegSuccess();
                })
                .error(function (data, status, headers, config) {
                    $scope.showRegFail();
                });
        };
    })

    .controller('ViewPatientsCtrl', function ($scope, $http, $rootScope, $window, $cordovaGeolocation) {
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

        $scope.uploadLocation = function () {
            var options = {timeout: 10000, enableHighAccuracy: true};
            $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
                console.log("Found user at location '" + position.coords.latitude + "," + position.coords.longitude + "', pushing to DB");
                // POST request body
                var locationData =
                    {
                        "Latitude": position.coords.latitude,
                        "Longitude": position.coords.longitude
                    };

                $http.post('http://patienttrackapiv2.azurewebsites.net/api/Patients/AddLocation/17', locationData)
                    .success(function () {
                        console.log('Updated location');
                    })
                    .error(function (error) {
                        console.log('Error updating location');
                        console.log("Error: " + error);
                    });

            }, function (error) {
                console.log("Could not get interval location");
                console.log(error);
            });
        };
    })

    .controller('PatientDetailsCtrl', function ($scope) {
    })

    .controller('SettingsCtrl', function ($scope, $rootScope, $http) {
        $scope.updateUsername = function () {
            var data =
                {
                    "CarerID": $rootScope.carers.CarerID,
                    "Patients": $rootScope.carers.Patients,
                    "CarerFName": this.updatedUsername,
                    "CarerEmail": $rootScope.carers.CarerEmail,
                    "CarerPwd": $rootScope.carers.CarerPwd
                };
            $http.put('http://patienttrackapiv2.azurewebsites.net/api/Carers/' + $rootScope.carers.CarerID, data)
                .success(function (data, status, headers, config) {
                    console.log('Updated username successfully');
                    $rootScope.carers = data;
                    $scope.showChangeNameAlert();
                })
                .error(function (data, status, headers, config) {
                    console.log('Error updating username');
                    $scope.showChangeNameError();
                });
        };
    })

    .controller('ChangePasswordCtrl', function ($scope, $rootScope, $http) {
        $scope.updatePwd = function () {
            if (this.currentPwd == $rootScope.carers.CarerPwd) {
                if (this.newPwd1 == this.newPwd2) {
                    var data =
                        {
                            "CarerID": $rootScope.carers.CarerID,
                            "Patients": $rootScope.carers.Patients,
                            "CarerFName": $rootScope.carers.CarerFName,
                            "CarerEmail": $rootScope.carers.CarerEmail,
                            "CarerPwd": this.newPwd1
                        };
                    $http.put('http://patienttrackapiv2.azurewebsites.net/api/Carers/' + $rootScope.carers.CarerID, data)
                        .success(function (data, status, headers, config) {
                            console.log('Updated password successfully');
                            $rootScope.carers = data;
                            $scope.showPwdChange();
                        })
                        .error(function (data, status, headers, config) {
                            console.log('Error updating password');
                            $scope.showPwdError();
                        });
                }
                else {
                    $scope.showPwdMismatch();
                }
            }
            else {
                $scope.showOldPwdError();
            }
        };
    })

    .controller('PopupCtrl', function ($scope, $ionicPopup, $timeout, $rootScope, $http, $window) {

        $scope.showAddPopup = function () {
            // Popup for adding a new patient
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="patientCode">',
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
                        onTap: function () {
                            $http.put('http://patienttrackapiv2.azurewebsites.net/api/Carers/' + $rootScope.carers.CarerID + '/AddPatient/' + this.scope.patientCode)
                                .success(function (data, status, headers, config) {
                                    console.log('Added patient successfully');
                                    $http.get('http://patienttrackapiv2.azurewebsites.net/api/Carers/' + $rootScope.carers.CarerID)
                                        .success(function (data, status, headers, config) {
                                            console.log('data success');
                                            console.log(data); // for browser console
                                            $rootScope.carers = data; // for UI
                                        });
                                    $scope.showAddPatient();
                                })
                                .error(function (data, status, headers, config) {
                                    console.log('Error updating username');
                                    $scope.showAddPatientError();
                                });
                        }
                    }]
            });
        };

// A confirm dialog for deleting a patient
        $scope.showConfirmDeletePatient = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete Patient',
                template: 'Are you sure you wish to delete this patient?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    console.log('Deleting patient');
                    $http.delete('http://patienttrackapiv2.azurewebsites.net/api/Carers/' + $rootScope.carers.CarerID + '/DeletePatient/' + $rootScope.selectedPatient.PatientID)
                        .success(function (data, status, headers, config) {
                            console.log('Deleted patient successfully');
                            $http.get('http://patienttrackapiv2.azurewebsites.net/api/Carers/' + $rootScope.carers.CarerID)
                                .success(function (data, status, headers, config) {
                                    console.log('data success');
                                    console.log(data); // for browser console
                                    $rootScope.carers = data; // for UI
                                });
                            $window.location.href = '#/ViewPatients';
                            $scope.showDeletePatient();
                        })
                        .error(function (data, status, headers, config) {
                            $scope.showDeletePatientError();
                        });
                } else {
                    console.log('Patient deletion cancelled');
                }
            });

            $timeout(function () {
                confirmPopup.close(); //close the popup after 10 seconds to avoid accidents
            }, 10000);
        };

// A confirm dialog for deleting a patient
        $scope.showConfirmDeleteAccount = function () {
            var confirmPopup = $ionicPopup.show({
                template: '<input type="password" ng-model="userPwd">',
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
                        onTap: function () {
                            // delete carer
                            if (this.scope.userPwd == $rootScope.carers.CarerPwd) {
                                $http.delete('http://patienttrackapiv2.azurewebsites.net/api/Carers/' + $rootScope.carers.CarerID)
                                    .success(function (data, status, headers, config) {
                                        console.log('Deleted account successfully');
                                        $rootScope.carers = null;
                                        $window.location.href = '#/Register';
                                        $scope.showDelete();
                                    })
                                    .error(function (data, status, headers, config) {
                                        console.log('Error updating password');
                                        console.log('Data: ' + JSON.stringify(data));
                                        console.log('Status: ' + JSON.stringify(status));
                                        console.log('headers: ' + JSON.stringify(headers));
                                        console.log('Config: ' + JSON.stringify(config));
                                        $scope.showDeleteError();
                                    });
                            }
                            else {
                                $scope.showDeletePwdError();
                            }
                        }
                    }
                ]
            });

            $timeout(function () {
                confirmPopup.close(); //close the popup after 10 seconds to avoid accidents
            }, 10000);
        };

// An alert dialog for username change
        $scope.showChangeNameAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Username Changed'
            });

            alertPopup.then(function (res) {
                console.log('Username changed');
            });
        };

// An alert dialog for username change
        $scope.showChangeNameError = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Username could not be changed'
            });

            alertPopup.then(function (res) {
                console.log('Username not changed');
            });
        };

// An alert dialog for login failure
        $scope.showLoginFail = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Details not found',
                subTitle: 'Please check your credentials'
            });

            alertPopup.then(function (res) {
                console.log('Login attempt failed');
            });
        };

// An alert dialog for registration failure
        $scope.showRegFail = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Registration error',
                subTitle: 'Possible causes:' +
                '<br>\u2022 Account already exists' +
                '<br>\u2022 Invalid email' +
                '<br>\u2022 Server issue'
            });

            alertPopup.then(function (res) {
                console.log('Registration attempt failed');
            });
        };

// An alert dialog for registration success
        $scope.showRegSuccess = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Registration success!',
                subTitle: 'Please proceed to login'
            });
        };

// An alert dialog for mismatching new password entries
        $scope.showPwdMismatch = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'New password entries do not match',
                subtitle: 'Password not changed'
            });
        };

// An alert dialog for password change success
        $scope.showPwdChange = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Password changed'
            });
        };

// An alert dialog for misc password change error
        $scope.showPwdError = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Could not change password',
                subtitle: 'You did everything right, something went wrong on our end.'
            });
        };

// An alert dialog for incorrect 'current password'
        $scope.showOldPwdError = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Current password incorrect'
            });
        };

// An alert dialog for incorrect password on delete account
        $scope.showDeletePwdError = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Password incorrect',
                subtitle: 'Account not deleted'
            });
        };

// An alert dialog for misc delete account error
        $scope.showDeleteError = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Account could not be deleted',
                subtitle: 'You did everything right, something went wrong on our end.'
            });
        };

// An alert dialog for delete account success
        $scope.showDelete = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Account deleted'
            });
        };

// An alert dialog for add patient success
        $scope.showAddPatient = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Patient added'
            });
        };

// An alert dialog for add patient error
        $scope.showAddPatientError = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Patient could not be added'
            });
        };

// An alert dialog for add patient error
        $scope.showPatientNotFound = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Patient not found'
            });
        };

        // An alert dialog for add patient error
        $scope.showDeletePatient = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Patient removed'
            });
        };

        // An alert dialog for add patient error
        $scope.showDeletePatientError = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Patient could not be removed'
            });
        };
    });






