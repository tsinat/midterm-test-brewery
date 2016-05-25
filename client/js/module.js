'use strict';

var app = angular.module('myApp', ['ui.router']);

app.run(function(Auth) {
    Auth.getProfile();
});

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '/html/home.html',
            controller: 'homeCtrl'
        })
        .state('register', {
            url: '/register',
            templateUrl: '/html/register.html',
            controller: 'registerCtrl'
        })
        .state('login', {
            url: '/login',
            templateUrl: '/html/login.html',
            controller: 'loginCtrl'
        })
        .state('beer', {
            url: '/beer',
            templateUrl: '/html/beer.html',
            controller: 'beerCtrl'
        })
        .state('beerDetail', {
            url: '/beerDetail/:id',
            templateUrl: '/html/beerDetail.html',
            controller: 'beerDetailCtrl',
            resolve: {
                name: function (Auth, $stateParams) {
                    console.log($stateParams.id);
                    return Auth.getOne($stateParams.id)
                }
            }
        })
        .state('profile', {
            url: '/profile',
            templateUrl: '/html/profile.html',
            controller: 'mainCtrl',
            resolve: {
                profile: function(Auth, $q, $state) {
                    return Auth.getProfile()
                        .catch(() => {
                            $state.go('home');
                            return $q.reject();
                        });
                }
            }
        })

    $urlRouterProvider.otherwise('/');
});
