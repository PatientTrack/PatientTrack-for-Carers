angular.module('starter.controllers', ['ionic'])

    .controller('LoginCtrl', function ($scope, $http, $rootScope, $window, $ionicLoading) {
        $scope.getDetails = function () {
            $ionicLoading.show();
            $http.get('http://patienttrackapiv2.azurewebsites.net/api/Carers/' + this.loginEmail + '/' + this.loginPwd)
                .success(function (data, status, headers, config) {
                    $ionicLoading.hide();
                    console.log('data success');
                    console.log(data); // for browser console
                    $rootScope.carers = data; // for UI
                    $window.location.href = '#/ViewPatients';
                    $window.localStorage.setItem('pt4cLoginEmail', $rootScope.carers.CarerEmail);
                    $window.localStorage.setItem('pt4cLoginPwd', $rootScope.carers.CarerPwd);
                })
                .error(function (data, status, headers, config) {
                    $ionicLoading.hide();
                    $scope.showLoginFail();
                });
        };
    })

    .controller('RegisterCtrl', function ($scope, $http, $ionicLoading, $window, $rootScope) {

        // Check if user has stored login details
        var email = $window.localStorage.getItem('pt4cLoginEmail');
        var pwd = $window.localStorage.getItem('pt4cLoginPwd');
        if (email != undefined && pwd != undefined) {
            console.log('Logging in from localstorage');
            $ionicLoading.show();
            $http.get('http://patienttrackapiv2.azurewebsites.net/api/Carers/' + email + '/' + pwd)
                .success(function (data, status, headers, config) {
                    $ionicLoading.hide();
                    console.log('data success');
                    console.log(data); // for browser console
                    $rootScope.carers = data; // for UI
                    $window.location.href = '#/ViewPatients';
                })
                .error(function (data, status, headers, config) {
                    $ionicLoading.hide();
                    $scope.showLoginFail();
                });
        }

        $scope.registerCarer = function () {
            $ionicLoading.show();
            var data =
                {
                    "Patients": [],
                    "CarerFName": this.regUsername,
                    "CarerEmail": this.regEmail,
                    "CarerPwd": this.regPwd
                };
            $http.post('http://patienttrackapiv2.azurewebsites.net/api/Carers/', data)
                .success(function (data, status, headers, config) {
                    $ionicLoading.hide();
                    console.log('Registered successfully');
                    $window.location.href = '#/Tab/Login';
                    $scope.showRegSuccess();
                })
                .error(function (data, status, headers, config) {
                    $ionicLoading.hide();
                    $scope.showRegFail();
                });
        };
    })

    .controller('ViewPatientsCtrl', function ($scope, $http, $rootScope, $window, $ionicLoading) {
        $scope.viewPatient = function (index) {
            $ionicLoading.show();
            $window.location.href = '#/PatientDetails'
            angular.element(document).ready(function () {
                $http.get('http://patienttrackapiv2.azurewebsites.net/api/Patients/' + $rootScope.carers.Patients[index].PatientID)
                    .success(function (data, status, headers, config) {
                        $ionicLoading.hide();
                        console.log('data success');
                        console.log(data); // for browser console
                        $rootScope.selectedPatient = data; // for UI
                        var lat = data.Locations[data.Locations.length - 1].Latitude;
                        var long = data.Locations[data.Locations.length - 1].Longitude;
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
                    })
                    .error(function (data, status, headers, config) {
                        $ionicLoading.hide();
                        $scope.showViewPatientError();
                    });
            });
        }
    })

    .controller('PatientDetailsCtrl', function ($scope) {
    })

    .controller('PrivacyPolicyCtrl', function ($scope) {
    })

    .controller('HelpCtrl', function ($scope) {
    })

    .controller('PatientSettingsCtrl', function ($scope, $ionicLoading, $http, $rootScope) {
        $scope.updatePatientAddress = function () {
            $ionicLoading.show();
            // PUT Request body - contains new Address
            var data =
                {
                    "Locations": $rootScope.selectedPatient.Locations,
                    "Carers": $rootScope.selectedPatient.Carers,
                    "PatientID": $rootScope.selectedPatient.PatientID,
                    "PatientFName": $rootScope.selectedPatient.PatientFName,
                    "PatientEmail": $rootScope.selectedPatient.PatientEmail,
                    "PatientPwd": $rootScope.selectedPatient.PatientPwd,
                    "PatientPostcode": this.updatedAddress,
                    "PatientCode": $rootScope.selectedPatient.PatientCode
                };

            $http.put('http://patienttrackapiv2.azurewebsites.net/api/Patients/' + $rootScope.selectedPatient.PatientID, data)
                .success(function (data) {
                    $ionicLoading.hide();
                    console.log('Updated Address successfully');
                    $rootScope.selectedPatient = data;
                    $scope.showChangeAddressAlert();
                })
                .error(function () {
                    $ionicLoading.hide();
                    console.log('Error updating Address');
                    $scope.showChangeAddressError();
                });
        };
    })

    .controller('SettingsCtrl', function ($scope, $rootScope, $http, $ionicLoading, $window) {
        $scope.updateUsername = function () {
            $ionicLoading.show();
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
                    $ionicLoading.hide();
                    console.log('Updated username successfully');
                    $rootScope.carers = data;
                    $scope.showChangeNameAlert();
                })
                .error(function (data, status, headers, config) {
                    $ionicLoading.hide();
                    console.log('Error updating username');
                    $scope.showChangeNameError();
                });
        };

        $scope.signOut = function () {
            $ionicLoading.show();
            $window.localStorage.removeItem("pt4cLoginEmail");
            $window.localStorage.removeItem("pt4cLoginPwd");
            $window.location.href = '#/tab/Login';
            $ionicLoading.hide();
        }
    })

    .controller('ChangePasswordCtrl', function ($scope, $rootScope, $http, $ionicLoading) {
        $scope.updatePwd = function () {
            if (this.currentPwd == $rootScope.carers.CarerPwd) {
                if (this.newPwd1 == this.newPwd2) {
                    $ionicLoading.show();
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
                            $window.localStorage.removeItem("pt4cLoginPwd");
                            $window.localStorage.setItem('pt4cLoginPwd', $rootScope.carers.CarerPwd);
                            $ionicLoading.hide();
                            $scope.showPwdChange();
                        })
                        .error(function (data, status, headers, config) {
                            $ionicLoading.hide();
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

    .controller('PopupCtrl', function ($ionicHistory, $scope, $ionicPopup, $timeout, $rootScope, $http, $window, $ionicLoading) {

        $scope.goBack = function() {
            $ionicHistory.backView().go();
        };

        $scope.showAddPopup = function () {
            // Popup for adding a new patient
            var myPopup = $ionicPopup.show({
                template: '<input type="text" ng-model="patientCode" autocapitalize="none">',
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
                            $ionicLoading.show();
                            $http.put('http://patienttrackapiv2.azurewebsites.net/api/Carers/' + $rootScope.carers.CarerID + '/AddPatient/' + this.scope.patientCode)
                                .success(function (data) {
                                    console.log('Added patient successfully');
                                    $http.get('http://patienttrackapiv2.azurewebsites.net/api/Carers/' + $rootScope.carers.CarerID)
                                        .success(function (data) {
                                            console.log('data success');
                                            console.log(data); // for browser console
                                            $rootScope.carers = data; // for UI
                                        });
                                    $ionicLoading.hide();
                                    $scope.showAddPatient();
                                })
                                .error(function () {
                                    $ionicLoading.hide();
                                    console.log('Error adding patient');
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
                    $ionicLoading.show();
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
                            $ionicLoading.hide();
                            $scope.showDeletePatient();
                        })
                        .error(function (data, status, headers, config) {
                            $ionicLoading.hide();
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
                                $ionicLoading.show();
                                $http.delete('http://patienttrackapiv2.azurewebsites.net/api/Carers/' + $rootScope.carers.CarerID)
                                    .success(function () {
                                        console.log('Deleted account successfully');
                                        $rootScope.carers = null;
                                        $window.location.href = '#/Register';
                                        $window.localStorage.removeItem("pt4cLoginEmail");
                                        $window.localStorage.removeItem("pt4cLoginPwd");
                                        $ionicLoading.hide();
                                        $scope.showDelete();
                                    })
                                    .error(function (data, status, headers, config) {
                                        $ionicLoading.hide();
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

        // An alert dialog for Address change
        $scope.showChangeAddressAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: $rootScope.selectedPatient.PatientFName + '\'s address changed'
            });
        };

// An alert dialog for Address change
        $scope.showChangeAddressError = function () {
            var alertPopup = $ionicPopup.alert({
                title: $rootScope.selectedPatient.PatientFName + '\'s address could not be changed'
            });
        };

// An alert dialog for username change
        $scope.showChangeNameAlert = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Username Changed'
            });
        };

// An alert dialog for username change
        $scope.showChangeNameError = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Username could not be changed'
            });
        };

// An alert dialog for login failure
        $scope.showLoginFail = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Details not found',
                subTitle: 'Please check your credentials'
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

        // An alert dialog for add patient error
        $scope.showViewPatientError = function () {
            var alertPopup = $ionicPopup.alert({
                title: 'Patient details could not be loaded'
            });
        };
    });






