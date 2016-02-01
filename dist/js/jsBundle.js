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

(function() {
    'use strict';
    angular.module('app')
        .controller('DialogController', function($scope, $mdDialog, $state, UserService) {

            var vm = this;
            vm.status = UserService.status;

            vm.logout = function() {
                localStorage.removeItem('token');
                vm.status.isLoggedIn = false;
                vm.status.callid = null;
                vm.status.username = null;
                vm.status.id = null;
                $state.reload();
            };

            $scope.showTabDialog = function(ev) {
                $mdDialog.show({
                    controllerAs: 'vm',
                    controller: DialogController,
                    templateUrl: 'views/Dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true
                });
            };
        });

    function DialogController($scope, $mdDialog, $mdToast, $state, UserService) {
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
                $state.reload();
            });
        };

    }
})();

(function() {
    'use strict';
    angular.module('app')
        .controller('HomeController', HomeController);

    function HomeController(UserService, HomeFactory) {
        var vm = this;
        vm.list = [];
        vm.contacts = [];
        vm.status = UserService.status;
        vm.isOpen = false;
        vm.is = false;

        vm.open = function() {
            vm.list.length = 0;
            vm.is = false;
        }

        vm.getAll = function() {
            HomeFactory.get_contacts().then(function(res) {
                for (var i = 0; i < res.length; i++) {
                    vm.contacts.push(res[i]);
                }
            });
        };

        vm.add_contact = function(id) {
            var user = {
                add_id: id,
                logged_in_id: vm.status.id
            };
            HomeFactory.add_contact(user).then(function(res) {
                vm.getAll();
                vm.list.length = 0;
            });
        };

        vm.look = function(search) {
            vm.list.length = 0;
            HomeFactory.contact_list_search(search).then(function(res) {
                for (var i = 0; i < res.length; i++) {
                    vm.list.push(res[i]);
                }
            });
        };

        if (localStorage.token) {
            vm.getAll();
        }
    }
})();

(function() {
    'use strict';
    angular.module('app')
        .factory('HomeFactory', HomeFactory);

    function HomeFactory($http, $q, UserService) {
        var o = {};
        o.contact_list_search = contact_list_search;
        o.add_contact = add_contact;
        o.get_contacts = get_contacts;
        return o;

        function contact_list_search(search) {
            var q = $q.defer();
            $http.post('/users/search', search).success(function(res) {
                q.resolve(res);
            });
            return q.promise;
        }

        function add_contact(user) {
            var q = $q.defer();
            $http.post('/users/add', user).success(function(res) {
                q.resolve(res);
            });
            return q.promise;
        }

        function get_contacts() {
            var q = $q.defer();
            $http.get('/users/contacts').success(function(res) {
                q.resolve(res);
            });
            return q.promise;
        }

    }
})();

(function() {
    'use strict';
    angular.module('app')
        .factory('HTTPFactory', HTTPFactory);

    function HTTPFactory($window) {
        return {
            request: function(config) {
                config.headers = config.headers || {};
                config.headers['Accepts'] = 'application/json';
                config.headers['Content-Type'] = 'application/json';
                if ($window.localStorage.getItem('token')) {
                    config.headers.authorization = "Bearer " + $window.localStorage.getItem('token');
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

    function UserService($http, $q, $window, $mdToast) {
        var o = {};
        o.status = {};
        if (getToken()) {
            o.status.isLoggedIn = true;
            o.status.callid = getCallId();
            o.status.username = getUserName();
            o.status.id = getId();
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
            }).error(function(res) {
                $mdToast.show($mdToast.simple().textContent(res.message));
            });
            return q.promise;
        }

        function register(user) {
            var q = $q.defer();
            $http.post('/users/register', user).success(function(res) {
                o.login(user);
                q.resolve();
            }).error(function(res) {
                $mdToast.show($mdToast.simple().textContent(res.message));
            });
            return q.promise;
        }

        function setToken(token) {
            localStorage.setItem('token', token);
            o.status.callid = getCallId();
            o.status.username = getUserName();
            o.status.id = getId();
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

        function getId() {
            return JSON.parse(atob(getToken().split('.')[1])).id;
        }
    }
})();