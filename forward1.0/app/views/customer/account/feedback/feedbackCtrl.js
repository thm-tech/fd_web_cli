define(['angular', 'app','services/checkcookie'], function (angular, app) {
    app.controller('FeedbackCtrl', ['$scope', '$rootScope', '$http','$modal', 'hascookie',function ($scope, $rootScope, $http,$modal,hascookie) {	
	var host = $rootScope.proxyUrl;
	document.title = "在线反馈 -喵喵熊";
	$scope.send=function(){
		if(hascookie.check('cm')) {
			var content={'feedback':$scope.content};
			var modalInstance=$modal.open({
				animation: true,
				templateUrl: 'views/customer/account/feedback/feedconfirm.html',
				controller: ['$scope', '$modalInstance','$http' , function ($scope, $modalInstance,$http) {
					$scope._cancel = function() {
					   $modalInstance.close();
							};
					$scope._confirm=function(){
						$modalInstance.close();
					};
				$http({
				url:host+'/user/feedback',
				method:'POST',
				data:content
				}).success(function(data){
					if(data.err==0){	
					//alert("提交成功，感谢您的反馈！");
					$scope.feedres="提交成功，感谢您的反馈！";
					$scope.content="";
					}else{
					$scope.feedres="提交失败，请稍后重试！";
					}
			
			});
			
					
				}],
				resolve: {
							host: function () {
								return $scope.host;
							}
						},
				 size: 'sm',
				 windowClass: 'mag-pop-modal',
				 backdropClass: 'modal-backdrop'
			});
			 modalInstance.result.then(function () {
					});
		}
	}
	
	
	
	}])
})