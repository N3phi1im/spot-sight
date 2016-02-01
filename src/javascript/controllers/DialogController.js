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
