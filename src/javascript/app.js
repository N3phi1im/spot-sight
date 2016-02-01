(function() {
  'use strict';
  angular.module('app', ['ui.router', 'ngMaterial'])
    .config(Config);

  function Config($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider, $mdThemingProvider, $mdIconProvider, $httpProvider) {
    $stateProvider.state('Home', {
      url: '/',
      templateUrl: 'views/home.html',
      controller: 'HomeController as vm'
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
})();
