(function() {
    'use strict';
    angular.module('app', ['ui.router', 'ngMaterial'])
        .config(Config);

    function Config($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider, $mdThemingProvider, $mdIconProvider) {
        $stateProvider.state('Home', {
            url: '/',
            templateUrl: 'views/home.html',
            controller: 'HomeController as vm'
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

(function() {
    'use strict';
    angular.module('app')
        .controller('DialogController', function($scope, $mdDialog, $mdMedia) {

            $scope.showTabDialog = function(ev) {
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'templates/Dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });
            };
        });

    function DialogController($scope, $mdDialog) {
        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }
})();

(function() {
    'use strict';
    angular.module('app')
        .controller('HomeController', HomeController);

    function HomeController() {
        var vm = this;
    }
})();

(function() {
    'use strict';
    angular.module('app')
        .factory('HomeFactory', HomeFactory);

    function HomeFactory($http, $q) {
        var o = {};

        return o;
    }
})();