(function() {
  'use strict';
  angular.module('app', ['ui.router', 'ngMaterial'])
    .config(Config)
    .run(auth);

  function Config($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider, $mdThemingProvider, $mdIconProvider, $httpProvider) {
    $stateProvider.state('Home', {
      url: '/',
      templateUrl: 'views/home.html',
      controller: 'HomeController as vm'
    }).state('Welcome', {
      url: '/welcome',
      templateUrl: 'views/welcome.html',
    });
    $urlRouterProvider.otherwise('/');
    $urlMatcherFactoryProvider.caseInsensitive(true);
    $urlMatcherFactoryProvider.strictMode(false);
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('HTTPFactory');
    $mdThemingProvider.theme('default')
      .primaryPalette('deep-orange')
      .accentPalette('deep-purple');
    $mdIconProvider.defaultFontSet('material-icons');
  }

  auth.$inject = ['$rootScope', '$location', '$state', 'UserService'];
	function auth($rootScope, $location, $state, UserService) {
		$rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
      var userInfo = UserService.status;
			if(!userInfo.isLoggedIn) {
				var welcome = toState.name === "Welcome";
				if(welcome) {
					return;
				}
				$location.url('/welcome');
			}
		});
	}

})();
