'use strict';

define(['angular','app'], function(angular,app) {
 		
    app.directive('checkCaptcha', ['$rootScope','$http', function($rootScope,$http) {
    var host = $rootScope.proxyUrl;
    return {
		restrict: 'A',
        require : 'ngModel',
        link : function($scope, elm, attrs, ctrl) {
            elm.bind('blur', function() {
			 if($scope.telephone_no!=null){
				var capt={'code':$scope.captcha};
                $http.post(host + '/basic/phonevalidate/'+$scope.telephone_no,{'code':$scope.captcha})
				.success(function(data, status, headers, config) {	
				if(data.is_success==false){
				ctrl.$setValidity('captchaa',false);
				}else{
				ctrl.$setValidity('captchaa',true);
			
				}} ) 
										}else{
								ctrl.$setValidity('captchaa',false);				}
										});
        }
    };
	}]);
	
});
