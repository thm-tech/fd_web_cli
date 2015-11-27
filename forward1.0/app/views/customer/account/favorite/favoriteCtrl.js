'use strict';
Array.prototype.S=String.fromCharCode(2);
Array.prototype.in_array=function(e){
    var r=new RegExp(this.S+e+this.S);
    return (r.test(this.S+this.join(this.S)+this.S));
};
define(['angular', 'app','qrcode', 'qrcodeUTF8','services/checkcookie'], function (angular, app) {
    app.controller('CollectCtrl', ['$scope', '$rootScope', '$http', '$window','$q','$timeout','$interval','hascookie',
	function ($scope, $rootScope, $http,$window,$q,$timeout,$interval,hascookie) {	
	var host = $rootScope.proxyUrl;
	var userid=$rootScope.globals.userID;
	var collecturl=host+'/userweb/'+userid+'/favorites';
	var fansurl=host+'/user/fans/diff';
	var user = $scope.user = {};
	user.allcolData = [];
	var TITLE = '收藏 -喵喵熊';
    document.title = TITLE;
	$scope.hascollect = true;	
	var getlist=function(offset,limit){
	
			$http({
			url:collecturl,
			method:'GET',
			params:{
				'limit':limit,
				'offset':offset,
					}
			})
			.success(function(goodslist){
				var _goods=goodslist.goods;
				for(var i=0;i<_goods.length;i++){
					if(_goods[i].promot<1){
						_goods[i].idontknow=_goods[i].price
						}else{
						_goods[i].idontknow=_goods[i].promot
							}
				};
				if(goodslist.goods.length > 0){	user.maxNum++;};
			user.allcolData = user.allcolData.concat(goodslist.goods);
			$scope.goodslist=goodslist.goods=user.allcolData;
				if($scope.goodslist.length > 0){
				$scope.nocollect=false;
				$scope.collect=true;
				}else{
				$scope.nocollect=true;
				$scope.collect=false;
				}
			
			});
			
	};
		$scope.toggle1=function(index,id){
			if(hascookie.check('cm')) {	
				$scope.goodslist[index].ifshow=$scope.goodslist[index].ifshow?false:true;
				$http.delete(host+'/user/goods/concern?gid='+id).success(function(res){});
			}	
		}
		$scope.toggle2=function(index,id){
			if(hascookie.check('cm')) {	
				$scope.goodslist[index].ifshow=$scope.goodslist[index].ifshow?false:true;	
				$http.post(host+'/user/goods/concern?gid='+id).success(function(res){});
			}	
		}
		//进入商品详情--start--
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
			var bcInterval;
			//****活动开始******
			var TITLE = '收藏 -喵喵熊';
			var actDelUrl = host + '/userweb/activity';
			var intoActFlag = true;
            user.showAct = false;
            var bcIntoAct = function(_arg) {
				if(hascookie.check('cm')) {
					if(_arg.type == 'list') {
						$scope.$broadcast('intoAct',{cid:user.curCity.id});
					}
					else if(_arg.type === 'del'){
						var displayAct = user.actList[_arg.idx];
						$scope.$broadcast('intoAct',{activity:displayAct});
					}
					else if(_arg.type === 'chatToDel'){
						var _actDelUrl = actDelUrl + '/' + _arg.id;
						$http({
							url:_actDelUrl,
							method:'GET'
						})        
						.success(function(data) {
							data.shopPic = data.shopPic[0];
							$scope.$broadcast('intoAct',{activity:data,fromChat:true});
						})
						.error();
					}
				}	
            };
			//展示活动列表
            user.intoAct = function() {
                user.scrollTop = $(window).scrollTop();//记住滚动条位置
                var activityCtrl = ['../views/customer/account/activity/activityCtrl'];
                var deferred = $q.defer();
                require(activityCtrl,function() {
                    $rootScope.$apply(function() {
                        deferred.resolve();        
                    });
                });
                deferred.promise.then(function(res) {
                    $scope.hascollect = false;    
                    $scope.shopdel = false;
                    user.showAct = true;
                });
            };
            //活动详情
            user.showActDet = function(idx) {
                if(intoActFlag) { 
                    intoActFlag = false;
                    user.intoAct();
                    bcInterval = $interval(function() {
                        bcIntoAct({type:'del',idx:idx});    
                    },300);
                }
            };
            user.chatToAct = function(actObj) {
                if(intoActFlag) { 
                    intoActFlag = false;
                    user.intoAct();
                    bcInterval = $interval(function() {
                        bcIntoAct({type:'chatToDel',id:actObj.id});    
                    },300);
                }
            };
                    
            user.sendAct = function(id,name,imgUrl) {
                    var msg = {type:'act',id:id,name:name,img:imgUrl};
                    $scope.$emit('_sendObjChannel',msg)
            };
            $scope.$on('recvAct',function(evt,msg) {
                $interval.cancel(bcInterval);
                intoActFlag = true;
            });
            $scope.$on('closeActList',function(evt,msg) {
                document.title = TITLE;
                $scope.hascollect = true;
                user.showAct = false;
				$scope.shopdel = false;
            });
            $scope.$on('closeActDet1',function(evt,msg) {
                document.title = TITLE;
                $scope.hascollect = true;
                user.showAct = false;
				$scope.shopdel = false;
            });
			$scope.$on('actToShop',function(evt,msg) {
                user.showAct = false;
                user._intoShop(msg);
            });
			//****活动结束******
			
			//响应用户点击聊天窗(商店或商品)
			var bcIntervalshop;
			var intoFlag = true;
			user.intoShop = function(id,idx) {
				if(hascookie.check('cm')) {
					user.scrollTop = $(window).scrollTop();//记住滚动条位置
					//console.log(user.scrollTop)
					var gObj = {
						gid:id,
						idx:idx
					};
					user._intoShop(gObj);	
				}
            };
			user._intoShop = function(obj) {
				if(intoFlag) {
					intoFlag = false;
					if(obj.sid) {
						countIntoShop(obj.sid);
					}
					_loadShop();
					bcIntervalshop = $interval(function() {
									 bcInfoShop(obj);
									 },300);  
				}
            };
            var countIntoShop = function(sid) {
				if(hascookie.check('cm')) {
					var countIntoUrl = host + '/user/shop/enter?sid=' + sid;
					$http({
						url:countIntoUrl,
						method:'POST'
					})
					.success(function(data) {
						
					})
					.error();
				}	
            };
			//加载商店相关文件
            var _loadShop = function() {
                var shopDelCtrl = ['../views/customer/account/shopDel/shopDelCtrl'];
                var deferred = $q.defer();
                require(shopDelCtrl,function() {
                    $rootScope.$apply(function() {
                        deferred.resolve();        
                    });
                });
                deferred.promise.then(function(res) {
                    $scope.hascollect = false;  
					user.showAct = false;
					$scope.shopdel = true;
                });        
            };
			//广播进店事件
            var bcInfoShop = function(shopObj) {
               var _shop = shopObj;
                _shop.scrollTop = user.scrollTop;
                $scope.$broadcast('intoShop',_shop);         
            };
			
			//响应开始。。。
			var goodsInfoUrl = host + '/user/goods/info';
			var shopNameUrl = host + '/user/shop/name';

            $scope.$on('_recvObjChannel',function(evt,msg) {
                if(msg.type === 'shop') {
					var shopIDs={'shopIDs':[]};
					$http.post(host+'/user/fans/diff',shopIDs).success(function(data){
					user.fansid=data.addShopIDs;
					var isFans=$scope.isFans=user.fansid.in_array(msg.id);
					});
                    var sObj = {sid:msg.id,sname:msg.name,isFans:!$scope.isFans,fromChat:true};
                    user._intoShop(sObj);
                }
                else if(msg.type === 'goods') {
                    var gObj = {gid:msg.id};
						$http({
							url:collecturl,
							method:'GET',
							params:{
								'limit':0,
								'offset':0,
								}
						}).success(function(fav){
						user.favids=[];
						for(i=0;i<fav.goods.length;i++){
							favids[i]=fav.goods[i].id;
						}
						var isfaved=$scope.isfaved=user.favids.in_array(msg.id);
						});
                    $http({
                        url:goodsInfoUrl,
                        method:'GET',
                        params: {'gid':msg.id,fromChat:true}
                    })
                    .success(function(data) {
                        if(data.err == 0) {
                            gObj.sid = data.info.shop_id;
                            $http({
                                url:shopNameUrl,
                                method:'GET',
                                params:{'sid':data.info.shop_id}
                            })
                            .success(function(data) {
                                if(data.err == 0) {
                                    gObj.sname = data.shopName;
									gObj.isFans = !$scope.isfaved;
                                    user._intoShop(gObj);
                                }
                            })
                            .error();
                        }
                    })
                    .error();
                }else if(msg.type === 'act') {
					
                    var actObj = {id:msg.id};
                    user.chatToAct(actObj);
                }
            });//进店结束-----
			
			   //商店js收到进店事件并响应
            $scope.$on('recv',function(evt,msg) {
				
					$interval.cancel(bcIntervalshop);    
					intoFlag = true;
				
            });
			//响应关闭商店事件
			$scope.$on('closeShop',function(evt,msg) {
				
					document.title = TITLE;
					if(msg.idx != undefined){
						$scope.goodslist[msg.idx].ifshow = !msg.isFans;
					}else{
						
					}
					$scope.hascollect = true;
					$scope.shopdel = false;
					user.showAct = false;
					$timeout(function() {
						$window.scrollTo(0,msg.scrollTop);
					},100);
				
			});
			
			//响应关闭商品详情事件
            $scope.$on('closeGoods',function(evt,msg) {
			
					document.title = TITLE;
					$scope.hascollect=true;
					$scope.shopdel = false;
					user.showAct = false;
					var index;
					for(i=0;i<$scope.goodslist.length;i++){
						if($scope.goodslist[i].id==msg.id){index=i}
					};
					if(index != undefined){
						$scope.goodslist[index].ifshow=!msg.isFav;
					};
					$timeout(function() {
							$window.scrollTo(0,user.scrollTop);
						},100);
				
            });
            $scope.$on('recv1',function(evt,msg) {
                //$interval.cancel(bcInterval);    
            });
		
		//进入商品详情--end---
			getlist(0,14);
           
            var range = 0; //距离下边界50px
            var num = 1;
			user.maxNum = num; //最大加载次数
            var totalHeight = 0;
			$scope.$on('scroll',function(evt,msg) {
                var scrollPos = $(window).scrollTop();
                var docHeight = msg.docHeight;
                var winHeight = $(window).height();  
                totalHeight = msg.totalHeight;
                if(docHeight - range <= totalHeight && user.allcolData.length != 0 && num != user.maxNum) {
							var offset = num*14;
							getlist(offset,14);
							num++;
                }
            });	
			
			
	
	}])
	
})