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

    if(localStorage.token) {
      vm.getAll();
    }
  }
})();
