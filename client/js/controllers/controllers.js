'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, Auth, $state) {

    $scope.$watch(function() {
        return Auth.currentUser;
    }, function(newVal, oldVal) {
        $scope.currentUser = newVal;
    });

    $scope.logout = () => {
        Auth.logout()
            .then(res => {
                $scope.currentUser = null;
                $state.go('login');
            });
    };
    $scope.showadd = false;
    $scope.showForm = () => {
        $scope.showadd = true;
    }
    $scope.hideForm = () => {
        $scope.showadd = false;
    }
    $scope.editProfile = user => {
        if (user.password !== user.password2) {
            user.password = '';
            user.password2 = '';
            alert('passwords must match.');
        }
        Auth.editPro($scope.currentUser._id, user)
    }

    $scope.mySampledBeer = () => {

        Auth.getMySampledBeer($scope.currentUser._id)
            .then(res => {
                console.log(res.data.sampledBeer);
                $scope.sumpledBeers = res.data.sampledBeer;
            })
            .catch(err => {
                console.log(err);
            })
    }
});
app.controller('sampledBeerCtrl', function($scope, Auth){
    console.log('sampledBeerCtrl');
    Auth.getMySampledBeer($scope.currentUser._id)
        .then(res => {
            console.log(res.data.sampledBeer);
            $scope.sumpledBeers = res.data.sampledBeer;
        })
        .catch(err => {
            console.log(err);
        })
})
app.controller('homeCtrl', function($scope) {
    console.log('homeCtrl');
});
app.controller('beerCtrl', function($scope, Auth, $state) {
    console.log('beerCtrl');
    allBeer();

    function allBeer() {
        Auth.getAllBeer()
        .then(res => {
            $scope.beers = res.data;
        })
        .catch(err => {
            console.log(err);
        });
    }

    $scope.newBeer = () => {
        Auth.getNewBeer()
            .then(res => {
                allBeer();
            })
            .catch(err => {
                console.log(err);
            })
    }
});

app.controller('beerDetailCtrl', function($scope, Auth, name){
    $scope.beer = name.data;

    $scope.addToSampled = (beer, currentUser) => {
        console.log(beer._id, currentUser._id);
        Auth.addToMySamples(currentUser._id, beer._id)
    }
})

app.controller('registerCtrl', function($scope, Auth, $state) {
    console.log('registerCtrl');

    $scope.registerForm = user => {
        console.log(user);
        if ($scope.user.password !== $scope.user.password2) {
            $scope.user.password = '';
            $scope.user.password2 = '';
            alert('passwords must match.');
        } else {
            Auth.register($scope.user)
                .then(res => {
                    Auth.login($scope.user);
                    $state.go('profile');
                })
                .catch(res => {
                    alert(res.data.error);
                });
        }
    };
});
app.controller('loginCtrl', function($scope, Auth, $state) {
    console.log('loginCtrl');
    $scope.loginForm = user => {
        Auth.login($scope.user)
            .then(res => {
                $state.go('profile');
            })
            .catch(res => {
                alert(res.data.error);
            })
    }
});

// app.controller('profileCtrl', function($scope, name, $state) {
//     console.log('profileCtrl');
//     $scope.logedUser = name;
// })
