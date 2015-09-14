(function() { 
	
	
'use strict';

var mgmtServices = angular.module('mgmtServices', ['ngResource']); 

mgmtServices.factory('WideMetrics',['$resource', 
	function($resource){
		return $resource('../data/highlights/', {}, {
			get: {method: 'GET', cache: false, isArray: false}
	});
}]);
	
	
	
	
	
	
	
}());