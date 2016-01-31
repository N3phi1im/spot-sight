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
