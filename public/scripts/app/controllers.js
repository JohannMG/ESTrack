(function() { 
	'use strict'; 
	
	/*  DashboardCtrl ------------------ */
	angular.module('mgmtApp').controller('DashboardCtrl', DashboardCtrl);
	DashboardCtrl.$inject = ['$scope','$location'];
	function DashboardCtrl($scope, $location){
		$scope.name = "World";
	}

	/*  ReportsCtrl ------------------ */
	angular.module('mgmtApp').controller('ReportsCtrl', ReportsCtrl);
	ReportsCtrl.$inject = ['$scope','$location'];
	function ReportsCtrl($scope, $location){
		$scope.bignum = 1267;
	}
	
	/*  navCtrl ------------------
		Controller for main navigation menu on all pages 
	*/
	angular.module('mgmtApp').controller('navCtrl', navCtrl);
	navCtrl.$inject = ['$scope','$location'];
	function navCtrl ($scope, $location){
		$scope.activeLink = function(linkPath){
			var currentPath = $location.path();
			return (currentPath === linkPath) ? "activePage" : "";
		}
	};
	
}());