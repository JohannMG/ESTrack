(function() { 
	'use strict'; 
	
	/*  DashboardCtrl ------------------ */
	angular.module('mgmtApp').controller('DashboardCtrl', DashboardCtrl);
	DashboardCtrl.$inject = ['$scope','$location'];
	function DashboardCtrl($scope, $location){
		
		$scope.wideMetrics = {
			totalUsers: 12902,
			users7Days: 102, 
			usersToday: 66
		};
		
		$scope.locations = [
			{
				name: "Orlando", 
				roomCount: 15, 
				userRecords: 1200,
				lastUser: 1442182805598,
				visitsToday: 20, 
				visitsYesterday: 130,
				visits7Days: 1000, 
				
			},
			{
				name: "Gatlinburg", 
				roomCount: 22, 
				userRecords: 1800,
				lastUser: 1442182882860,
				visitsToday: 80, 
				visitsYesterday: 250,
				visits7Days: 5400, 
				
			}
		]
	}//end DashboardCtrl



	/*  ReportsCtrl ------------------ */
	angular.module('mgmtApp').controller('ReportsCtrl', ReportsCtrl);
	
	ReportsCtrl.$inject = ['$scope','$location'];
	function ReportsCtrl($scope, $location){
		
		$scope.bignum = 1267;
		
	}//end ReportsCtrl
	
	
	
	
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
		
	}; //end navCtrl
	
}());