(function() {
  'use strict';
  angular.module('app')
    .controller('HomeController', HomeController);

  function HomeController(UserService, HomeFactory) {
    var vm = this;
    vm.list = [];
    vm.open = false;
    vm.status = UserService.status;
    vm.isOpen = false;
    vm.getAll = HomeFactory.get_contacts;
    // vm.getAll();

    vm.add_contact = function(id) {
      var user = {
				add_id: id,
				logged_in_id: vm.status.id
			};
      HomeFactory.add_contact(user).then(function(res) {
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

    vm.fab = {
      isOpen: false,
      count: 0,
    };

  }
})();
