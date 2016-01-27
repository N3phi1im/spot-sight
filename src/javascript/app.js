(function() {
	'use strict';
	angular.module('app', ['ui.router', 'ngMaterial'])
	.config(Config);

	function Config($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider, $mdThemingProvider, $mdIconProvider) {
		$stateProvider.state('Home',{
			url: '/',
			templateUrl: 'views/home.html',
      controller: 'HomeController as vm'
		});
		$urlRouterProvider.otherwise('/');
		$urlMatcherFactoryProvider.caseInsensitive(true);
		$urlMatcherFactoryProvider.strictMode(false);
		$locationProvider.html5Mode(true);
		$mdThemingProvider.theme('default')
    .primaryPalette('deep-purple')
    .accentPalette('deep-orange');
		$mdIconProvider.defaultFontSet('material-icons');
	}
})();
