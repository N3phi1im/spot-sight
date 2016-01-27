(function() {
	'use strict';
	angular.module('app')
	.controller('HomeController', HomeController);

	function HomeController(UserService) {
		var hc = this;
		hc.status = UserService.status;
	}
})();
