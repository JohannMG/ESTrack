 (function() { //namespace scope
 
 'use strict';


/*-----------------------
	MAIN MENU directive
------------------------*/
	var mgmtDirectives = angular.module('mgmtDirectives', []);
	mgmtDirectives.directive('mgmtNavMenu', function(){
		
		return {
			restrict: 'AE',
			templateUrl: '../scripts/app/partials/navMenu.html',
			link: function(){}
		};
	}); 


}());