try {
  // try to use localStorage
  localStorage.test = 2;
} catch (e) {
  // there was an error so...
  alert('You are in Privacy Mode\nPlease deactivate Privacy Mode and then reload the page.');
}

$(document).on('click', '.navbar-collapse.in', function(e) {
  if ($(e.target).is('a')) {
    $(this).collapse('hide');
  }
});

$(document).on('click', '.navbar-brand', function(e) {
  if ($(e.target).is('a')) {
    $('.navbar-collapse').collapse('hide');
  }
});

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