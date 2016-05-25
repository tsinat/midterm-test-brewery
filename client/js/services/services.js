'use strict';

var app = angular.module('myApp');

app.service('Auth', function($http, $q) {
    this.register = userObj => {
        return $http.post('/users/register', userObj);
    };
    this.login = userObj => {
        return $http.post('/users/authenticate', userObj)
            .then(res => {
                return this.getProfile();
            });
    };

    this.logout = () => {
        return $http.post('/users/logout')
            .then(res => {
                this.currentUser = null;
                return $q.resolve();
            });
    };
    this.getProfile = () => {
        return $http.get('/users/profile')
            .then(res => {
                this.currentUser = res.data
                return $q.resolve(res.data);
            })
            .catch(res => {
                this.currentUser = null;
                return $q.reject(res.data);
            });
    };
    this.editPro = (id, user) => {
        return $http.put(`/users/${id}`, user)
            .then(res => {
                return this.getProfile();
            })
            .catch(err => {
                return $q.reject(err)
            });
    };
    this.getAllBeer = () => {
        return $http.get('/api/beers');
    };

    this.getOne = id => {
        return $http.get(`/api/beers/${id}`)
    };

    this.getNewBeer = () => {
        return $http.get('/api/beers/beer')
    };

    this.addToMySamples = (userId, beerId) => {
        return $http.put(`/users/${userId}/sampleBeer/${beerId}`)
    };

    this.getMySampledBeer = id => {
        return $http.get(`/users/${id}`)
    }

});
