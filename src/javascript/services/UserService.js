(function() {
	'use strict';
	angular.module('app')
	.factory('UserService', UserService);

	function UserService($http, $q, $window) {
		var o = {};
		o.status = {};
		if (getToken()) {
			o.status.isLoggedIn = true;
			o.status.callid = getCallId();
			o.status.username = getUserName();
		}
		o.setToken = setToken;
		o.getToken = getToken;
		o.login = login;
		o.register = register;
		return o;

		function login(user) {
			var userObj = {
				username: user.username.toLowerCase(),
				password: user.password
			};
			var q = $q.defer();
			$http.post('/users/login', userObj).success(function(res) {
				setToken(res.token);
				o.status.isLoggedIn = true;
				q.resolve();
			});
			return q.promise;
		}

		function register(user) {
			var q = $q.defer();
			$http.post('/users/register', user).success(function(res) {
				o.status.isLoggedIn = true;
				q.resolve();
			});
			return q.promise;
		}

		function setToken(token) {
			localStorage.setItem('token', token);
			o.status.callid = getCallId();
			o.status.username = getUserName();
		}

		function getToken() {
			return localStorage.token;
		}

		function getCallId() {
			return JSON.parse(atob(getToken().split('.')[1])).callid;
		}

		function getUserName() {
			return JSON.parse(atob(getToken().split('.')[1])).username;
		}
	}
})();
