(function() {
	'use strict';
	angular.module('app')
	.controller('HomeController', HomeController);

	function HomeController(UserService) {
		var vm = this;
		vm.status = UserService.status;
	}
})();
