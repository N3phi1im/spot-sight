(function() {
    'use strict';
    angular.module('app', ['ui.router', 'ngMaterial'])
        .config(Config);

    function Config($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider, $locationProvider, $mdThemingProvider, $mdIconProvider) {
        $stateProvider.state('Home', {
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

(function() {
    'use strict';
    angular.module('app')
        .controller('DialogController', function($scope, $mdDialog, UserService) {

            var vm = this;
            vm.status = UserService.status;

            vm.logout = function() {
                localStorage.removeItem('token');
                vm.status.isLoggedIn = false;
                vm.status.callid = null;
                vm.status.username = null;
            };

            $scope.showTabDialog = function(ev) {
                $mdDialog.show({
                    controllerAs: 'vm',
                    controller: DialogController,
                    templateUrl: 'templates/Dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });
            };
        });

    function DialogController($scope, $mdDialog, $mdToast, UserService) {
        var vm = this;
        vm.user = {};
        vm.status = UserService.status;

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        vm.register = function() {
            var userObj = vm.user;
            if (!userObj.username || !userObj.password || !userObj.c_password || (userObj.password !== userObj.c_password)) {
                return false;
            }
            UserService.register(userObj).then(function() {
                $mdDialog.hide();
            });
        };

        vm.login = function() {
            UserService.login(vm.user).then(function() {
                $mdDialog.hide();
                $mdToast.show($mdToast.simple().textContent('Welcome back ' + vm.status.username.charAt(0).toUpperCase() + vm.status.username.slice(1) + '!'));
            });
        };

    }
})();

(function() {
    'use strict';
    angular.module('app')
        .controller('HomeController', HomeController);

    function HomeController(UserService) {
        var hc = this;
        hc.status = UserService.status;
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