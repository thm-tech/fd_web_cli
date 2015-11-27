'use strict';

define(['angular','app'], function(angular,app) {
	//var accounts = /^[a-zA-Z][^\u4e00-\u9fa5]*$/;
	var accounts = /^[a-zA-Z]\w+$/;
    app.directive('accountRule', function() {
    return {
        require : 'ngModel',
        link : function($scope, elm, attrs, ctrl) {
			ctrl.$parsers.unshift(function(viewValue) {
		   if(accounts.test($scope.account)){
		   ctrl.$setValidity('arule', true);
		   return viewValue;
											}else{
			ctrl.$setValidity('arule', false);
			return undefined;			
												}  
														})

													}
    };
});
});
