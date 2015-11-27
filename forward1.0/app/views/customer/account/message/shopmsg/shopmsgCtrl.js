Array.prototype.S=String.fromCharCode(2);
Array.prototype.in_array=function(e){
    var r=new RegExp(this.S+e+this.S);
    return (r.test(this.S+this.join(this.S)+this.S));
};
define(['angular', 'app','services/checkcookie'], function (angular, app) {
    app.controller('shopmsgCtrl', ['$scope', '$rootScope', '$http', '$window', '$timeout','$q', 'hascookie',
	function ($scope, $rootScope, $http,$window,$timeout,$q,hascookie) {	
	var host = $rootScope.proxyUrl;
	var user=$scope.user={};
	$scope.shopmsgshow=true;
	 $scope.$on('openshopmsg', function(evt,msg) {
		 var shopmsg=$scope.shopmsg=msg;
	 })
	  var broadcast = function(evt,msg) {
                if(msg) {
                    $scope.$broadcast(evt,msg);
                }
                else {
                    $scope.$broadcast(evt);
                }
            };
            var emit = function(evt,msg) {
                if(msg) {
                    $scope.$emit(evt,msg);
                }
                else {
                    $scope.$emit(evt);
                }
            };
	user.close=function(index){
		 if($scope.shopmsg.index != undefined) {
                    var closeData = {index:$scope.shopmsg.index,scrollTop:$scope.shopmsg.scrollTop};
                    emit('closeshopmsg',closeData);
                }
                else {
                    emit('closeshopmsg');
                }
	};
	
	user.intoshopdel=function(shopid,shopname,index){
		if(hascookie.check('cm')) {	
			var shopIDs={'shopIDs':[]};
			$http.post(host+'/user/fans/diff',shopIDs).success(function(data){
				fansid=data.addShopIDs;
				var isFans=$scope.isFans=fansid.in_array(shopid);
			})
			 user.scrollTop = $(window).scrollTop();
                _loadShop();
                
                $timeout(function() {
                    bcmsgdel(shopid,shopname,index);
                },300);
		}		
	}	
		var _loadShop = function() {
                var shopctrl = ['../views/customer/account/shopDel/shopDelCtrl'];
                var deferred = $q.defer();
                require(shopctrl,function() {
                    $rootScope.$apply(function() {
                        deferred.resolve();        
                    });
                });
                deferred.promise.then(function(res) {
                    $scope.shopmsgshow = false;
					$scope.shopshow=true;	
                });        
            };	
		var bcmsgdel = function(shopid,shopname,index) {
                    var _shop = {sid:shopid,sname:shopname,isFans:$scope.isFans,idx:index,scrollTop:user.scrollTop}; 
                $scope.$broadcast('intoShop',_shop);        
            };	
		$scope.$on('closeShop',function(evt,msg) {
			
               $scope.shopmsgshow = true;
			   $scope.shopshow=false;
                $timeout(function() {
                    $window.scrollTo(0,msg.scrollTop);
                },100);
			
		});
		user.lettertoshop = function(shopid){
			
				$scope.$emit('_chatToOwnerChannel',shopid);
		
		}
	
	}])
})