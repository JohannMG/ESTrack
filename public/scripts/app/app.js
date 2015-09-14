'use strict';

var mgmtApp = angular.module('mgmtApp', [
	'ngRoute',
	'ngResource',
	'mgmtDirectives',
	'mgmtServices'
]);

mgmtApp.config(['$routeProvider', '$locationProvider', 
function($routeProvider, $locationProvider){
	$routeProvider.
		when('/',{
			templateUrl: '../scripts/app/partials/dashboard.html',
			controller: 'DashboardCtrl'
		}).
		when('/reports',{
			templateUrl: '../scripts/app/partials/reports.html',
			controller: 'ReportsCtrl'
		}).
		// when('manage',{
		// 	templateUrl: 'partials/manage.html',
		// 	controller: 'ManagementCtrl'
		// }).
		// when('/users', {
		// 	templateUrl: 'partials/users.html',
		// 	controller: 'UsersCtrl'
		// }).
		otherwise( {redirectTo: '/'});
		
		$locationProvider
			.html5Mode(false)
			.hashPrefix('!');
		
		
		
}]);