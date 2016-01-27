(function() {
	'use strict';
	angular.module('app')
	.factory('HTTPFactory', HTTPFactory);

	function HTTPFactory($http, $q) {
		return {
			request: function(config) {
				config.headers = config.headers || {};
				config.headers['Accepts'] = 'application/json';
				config.headers['Content-Type'] = 'application/json';
				if ($window.localStorage.getItem('token')) {
					config.headers['Authorization'] = 'Bearer ' +
					$window.localStorage.getItem('token');
				}
				return config;
			}
		};
	}
})();
