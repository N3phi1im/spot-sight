(function() {
	'use strict';
	angular.module('app', ['ui.router', 'ngMaterial'])
	.config(Config);

	function Config($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider, $mdThemingProvider, $mdIconProvider) {
		$stateProvider.state('Home',{
			url: '/',
			templateUrl: 'templates/home.html',
      controller: 'HomeController as hc'
		});
		$urlRouterProvider.otherwise('/');
		$urlMatcherFactoryProvider.caseInsensitive(true);
		$urlMatcherFactoryProvider.strictMode(false);
		$locationProvider.html5Mode(true);
		$mdThemingProvider.theme('default')
    .primaryPalette('deep-orange')
    .accentPalette('deep-purple');
		$mdIconProvider.defaultFontSet('material-icons');
	}
})();
