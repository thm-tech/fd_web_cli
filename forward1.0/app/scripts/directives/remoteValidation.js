'use strict';

define(['angular','app'],  function(angular,app) {
    app.directive('remoteValidation', ['$rootScope','$http', function($rootScope,$http) {
    var host = $rootScope.proxyUrl;
    return {
		restrict: 'A',
        require : 'ngModel',
        link : function($scope, elm, attrs, ctrl) {
            elm.bind('blur', function() {
				//console.log('this log is in derective: '+$scope.user.account+' '+$scope.user.password)
                $http.get( host + '/merchant/isexist?account='+$scope.user.account)
				.success(function(data, status, headers, config) {	if(data.is_exist == true){
				ctrl.$setValidity('remote',false);
				}else{
				ctrl.$setValidity('remote',true);
				}} ) 
            });
        }
    };
	}]);
	
});
