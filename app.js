try {
  // try to use localStorage
  localStorage.test = 2;
} catch (e) {
  // there was an error so...
  alert('You are in Privacy Mode\nPlease deactivate Privacy Mode and then reload the page.');
}

angular.module('sample', [
  'ngRoute',
  'sample.search'
]).config(function myAppConfig($routeProvider) {

  $routeProvider
    .when('/', {
      controller: 'SearchCtrl',
      templateUrl: 'search/search.html',
      pageTitle: 'Search'
    });

}).controller('AppCtrl', function AppCtrl($scope) {});