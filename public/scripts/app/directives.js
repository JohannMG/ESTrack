'use strict'; 

(function() { //namespace scope

	var mgmtDirectives = angular.module('mgmtDirectives', []);
	
	mgmtDirectives.directive('mgmtNavMenu', function(){
		
		// var navCtrl =[ '$scope', '$location', function($scope, $location){
		// 	$scope.activeLink = function(linkPath){
		// 		var currentPath = $location.path();
		// 		return (currentPath === linkPath) ? "activePage" : "";
		// 	}
		// }];
		
		return {
			restrict: 'AE',
			templateUrl: '../scripts/app/partials/navMenu.html',
			link: function(){}
		};
	}); 


}());