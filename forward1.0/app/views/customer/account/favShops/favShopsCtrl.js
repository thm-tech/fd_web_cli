
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

define(['angular', 'app'], function (angular, app) {
    app.controller('FavCtrl', ['$scope', '$rootScope', '$http','$window', function ($scope, $rootScope, $http,$window) {	
	
	var host = $rootScope.proxyUrl;
	var userid=$rootScope.globals.userID;
	var user = $scope.user = {};
	user.allfavData = [];
	var shopIDs={'shopIDs':[]};
	var len=$scope.len;
	//$http.post(host+'/user/shop/concern?sid=10289').success(function(res){})
	
	var getlist=function(num){	
			$http.post(host+'/user/fans/diff',shopIDs).success(function(diff){

			user.favshopidlist=$scope.user.favshopidlist=diff.addShopIDs;
			len=user.favshopidlist.length;
			var listnums=Math.ceil(len/12);
		if(num<=listnums){
			var favss=[];			
			for(var i=12*(num-1);i<num*12;i++){favss[i]='sid='+user.favshopidlist[i]+'&'};
			var a="sid=undefined&";
			for(var i=0;i<12;i++){
			favss.remove("sid=undefined&");}
			var infourlstr=host+'/user/fans/info?'+favss.join('');
			var infourl=infourlstr.substring(0,infourlstr.length-1);

			var newurlstr=host+'/user/fans/news?'+favss.join('');
			var newurl=newurlstr.substring(0,newurlstr.length-1);
			
			$http({
				url:infourl,
				method:'GET',
			}).success(function(shoplist){
				user.allfavData = user.allfavData.concat(shoplist.shopList);	
				$scope.favlist=user.allfavData;
			$scope.toggle1=function(index,id){
				$scope.favlist[index].ifshow=$scope.favlist[index].ifshow?false:true;
				$http.delete(host+'/user/shop/concern?sid='+id).success(function(res){})
			}
			$scope.toggle2=function(index,id){
				$scope.favlist[index].ifshow=$scope.favlist[index].ifshow?false:true;	
				$http.post(host+'/user/shop/concern?sid='+id).success(function(res){})
			}
			
			});
			
			//查询是否新品和活动--start---
				$http({
					url:newurl,
					method:'GET'
				}).success(function(newres){
					for(var i=0;i<newres.shopList.length;i++){
						if(newres.shopList[i].hasNew == 1){
							$scope.favlist[i].hasNew=true;
						}
						else {
							$scope.favlist[i].hasNew=false;
						}
					}
				})
				//查询是否新品和活动--end---
			
		}
			})	
		
	}
			getlist(1);
            var maxNum = 20; //最大加载次数
            var range = 200; //距离下边界50px
            var num = 1;
            var totalHeight = 0;

            $window.onscroll = function() {
                var scrollPos = $(window).scrollTop();
                var docHeight = $(document).height();
                var winHeight = $(window).height();  
                totalHeight = parseFloat(winHeight) + parseFloat(scrollPos);
                if(docHeight - range <= totalHeight && user.allfavData.length != 0 && num != maxNum) {
                    //var offset = num*12;
                    getlist(num+1);
                    num++;
                }
            };	
	}])
	
})