
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

Array.prototype.S=String.fromCharCode(2);
Array.prototype.in_array=function(e){
    var r=new RegExp(this.S+e+this.S);
    return (r.test(this.S+this.join(this.S)+this.S));
};

define(['angular', 'app','services/checkcookie'], function (angular, app) {
    app.controller('FavCtrl', ['$scope', '$rootScope', '$http','$window', '$timeout','$q','$interval','hascookie',
		function ($scope, $rootScope, $http,$window,$timeout,$q,$interval,hascookie) {	
	document.title = "粉店 -喵喵熊";
	var host = $rootScope.proxyUrl;
	var userid=$rootScope.globals.userID;
	var user = $scope.user = {};
	user.allfavData = [];
	var shopIDs={'shopIDs':[]};
	user.len=$scope.user.len;
	var collecturl=host+'/userweb/'+userid+'/favorites';
	var fansurl=host+'/user/fans/diff';
	user._shopids=[];
	user.shopsShow = true;
	var getlist=function(num){	
		
				$http.post(host+'/user/fans/diff',shopIDs).success(function(diff){
				//剔除不存在的商店ID--start--
				vshopids=diff.addShopIDs;
				user.favsi=[];
				for(var i=0;i<vshopids.length;i++){user.favsi[i]='sid='+vshopids[i]+'&'};
				for(var i=0;i<vshopids.length;i++){user.favsi.remove("sid=undefined&");}
				var infourll=host+'/user/fans/info?'+user.favsi.join('');
				var infou=infourll.substring(0,infourll.length-1);
				$http({
					url:infou,
					method:'GET',
				}).success(function(shoplist){
					if(shoplist.err == 0){
					for(var i=0;i<shoplist.shopList.length;i++){
						//user._shopids.push(shoplist.shopList[i].id)
						user._shopids[i] = shoplist.shopList[i].id;
						};
				//剔除不存在的商店ID--end--
			user.favshopidlist= user._shopids;
				user.len=user.favshopidlist.length;
				var listnums=user.listnums=Math.ceil(user.len/16);

			if(num<=listnums){
				user.favss=[];			
				for(var i=16*(num-1);i<num*16;i++){user.favss[i]='sid='+user.favshopidlist[i]+'&'};
				for(var i=0;i<16;i++){user.favss.remove("sid=undefined&");}
				var infourlstr=host+'/user/fans/info?'+user.favss.join('');
				var infourl=infourlstr.substring(0,infourlstr.length-1);

				$http({
					url:infourl,
					method:'GET',
				}).success(function(shopres){
					user.allfavData = user.allfavData.concat(shopres.shopList);	
					$scope.favlist=user.allfavData;
					if($scope.favlist.length<1){
						$scope.nocollect=true;
						$scope.hascollect=false;
					}else{
						$scope.nocollect=false;
						$scope.hascollect=true;
					}
				//查询是否新品和活动--start---	
				user.favsss=[];			
				for(var i=0;i<user.len;i++){user.favsss[i]='sid='+user.favshopidlist[i]+'&'};
				for(var i=0;i<user.len;i++){user.favsss.remove("sid=undefined&")};			
				var newurlstr=host+'/user/fans/news?'+user.favsss.join('');
				var newurl=newurlstr.substring(0,newurlstr.length-1);
					$http({
						url:newurl,
						method:'GET'
					}).success(function(newres){
						if(user.len<16){
							for(var i=0;i<user.len;i++){		
									if(newres.shopList[i].hasNew == 1){
										user.allfavData[i].hasNew=true;
									}else {
										user.allfavData[i].hasNew=false;
									}	
								if(newres.shopList[i].hasAct == 1){
									user.allfavData[i].hasAct=true;
								}else {
									user.allfavData[i].hasAct=false;
								};				
							}	
						}else if(num<listnums){
							for(var i=0;i<num*16;i++){		
								if(newres.shopList[i].hasNew == 1){
									user.allfavData[i].hasNew=true;
								}else {
									user.allfavData[i].hasNew=false;
								}	
								if(newres.shopList[i].hasAct == 1){
									user.allfavData[i].hasAct=true;
								}else {
									user.allfavData[i].hasAct=false;
								};				
							}	
						}else if(num==listnums){
							for(var i=0;i<user.len;i++){	
								if(newres.shopList[i].hasNew == 1){
									user.allfavData[i].hasNew=true;
								}
								else {
									user.allfavData[i].hasNew=false;
								}
								if(newres.shopList[i].hasAct == 1){
									user.allfavData[i].hasAct=true;
								}else {
									user.allfavData[i].hasAct=false;
								};				
							}
						}
					})
					//查询是否新品和活动--end---
					
				$scope.toggle1=function(index,id){
					if(hascookie.check('cm')) {
						$scope.favlist[index].ifshow=$scope.favlist[index].ifshow?false:true;
						$http.delete(host+'/user/shop/concern?sid='+id).success(function(res){});
					}
				}
				$scope.toggle2=function(index,id){
					if(hascookie.check('cm')) {
						$scope.favlist[index].ifshow=$scope.favlist[index].ifshow?false:true;	
						$http.post(host+'/user/shop/concern?sid='+id).success(function(res){});
					}
				}	
				});
				
				
				}	
			}else{
				$scope.nocollect=true;
				}
			}).error()
			})
	
	}
		//****活动开始******
			var TITLE = '粉店 -喵喵熊';
			var actDelUrl = host + '/userweb/activity';
			var intoActFlag = true;
            user.showAct = false;
            var bcIntoAct = function(_arg) {
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
            };
			//展示活动列表
            user.intoAct = function() {
				if(hascookie.check('cm')) {
					user.scrollTop = $(window).scrollTop();//记住滚动条位置
					var activityCtrl = ['../views/customer/account/activity/activityCtrl'];
					var deferred = $q.defer();
					require(activityCtrl,function() {
						$rootScope.$apply(function() {
							deferred.resolve();        
						});
					});
					deferred.promise.then(function(res) {
						user.shopsShow = false;    
						user.showShop = false;
						user.showAct = true;
					});
				}	
            };
            //活动详情
            user.showActDet = function(idx) {
				if(hascookie.check('cm')) {
					if(intoActFlag) { 
						intoActFlag = false;
						user.intoAct();
						bcInterval = $interval(function() {
							bcIntoAct({type:'del',idx:idx});    
						},300);
					}
				}	
            };
            user.chatToAct = function(actObj) {
				if(hascookie.check('cm')) {
					if(intoActFlag) { 
						intoActFlag = false;
						user.intoAct();
						bcInterval = $interval(function() {
							bcIntoAct({type:'chatToDel',id:actObj.id});    
						},300);
					}
				}	
            };
                    
            user.sendAct = function(id,name,imgUrl) {
				if(hascookie.check('cm')) {
                    var msg = {type:'act',id:id,name:name,img:imgUrl};
                    $scope.$emit('_sendObjChannel',msg)
				}	
            };
            $scope.$on('recvAct',function(evt,msg) {
                $interval.cancel(bcInterval);
                intoActFlag = true;
            });
            $scope.$on('closeActList',function(evt,msg) {
                document.title = TITLE;
                user.shopsShow = true;
                user.showAct = false;
            });
            $scope.$on('closeActDet1',function(evt,msg) {
                document.title = TITLE;
                user.shopsShow = true;
                user.showAct = false;
            });
			$scope.$on('actToShop',function(evt,msg) {
                user.showAct = false;
                user._intoShop(msg);
            });
			//****活动结束******
			//进入商店	
			var bcInterval;	
			var intoFlag = true;
			user.intoShop = function(id,name,isFans,idx) {
				if(hascookie.check('cm')) {
					user.scrollTop = $(window).scrollTop();//记住滚动条位置
					var shopObj = {
						sid:id,
						sname:name,
						isFans:isFans,
						idx:idx
					};
					user._intoShop(shopObj);
				}		
            };
            user._intoShop = function(shopObj) {
				if(intoFlag) {
					intoFlag = false;
					countIntoShop(shopObj.sid);
					_loadShop();
					bcInterval = $interval(function() {
									//console.log('interval');
									 bcInfoShop(shopObj);
									 },300);  
				}
            };
            var countIntoShop = function(sid) {
                var countIntoUrl = host + '/user/shop/enter?sid=' + sid;
                $http({
                    url:countIntoUrl,
                    method:'POST'
                })
                .success(function(data) {
                    
                })
                .error();
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
                    user.shopsShow = false; 
					user.showShop = true;
					user.showAct = false;
                });        
            };
			//广播进店事件
            var bcInfoShop = function(shopObj) {
               var _shop = shopObj;
                _shop.scrollTop = user.scrollTop;
                $scope.$broadcast('intoShop',_shop);         
            };
			
			//响应用户点击聊天窗(商店或商品)
			var goodsInfoUrl = host + '/user/goods/info';
			var shopNameUrl = host + '/user/shop/name';

            $scope.$on('_recvObjChannel',function(evt,msg) {

                if(msg.type === 'shop') {
					var shopIDs={'shopIDs':[]};
					$http.post(fansurl,shopIDs).success(function(data){
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
                        params: {'gid':msg.id}
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
									//console.log(gObj);
                                }
                            })
                            .error();
                        }
                    })
                    .error();
                } else if(msg.type === 'act') {
                    var actObj = {id:msg.id};
                    user.chatToAct(actObj);
                }
            });//进店结束-----
			
			   //商店js收到进店事件并响应
            $scope.$on('recv',function(evt,msg) {
				
					$interval.cancel(bcInterval);
					intoFlag = true;
			
            });
				//响应关闭商店事件
			$scope.$on('closeShop',function(evt,msg) {
		
					document.title = "粉店 -喵喵熊";
					if(msg.idx != undefined){
					//	console.log(msg.isFans)
						user.allfavData[msg.idx].ifshow = !msg.isFans;
					}else{
						for(i=0;i<user.allfavData.length;i++){
							if(msg.shop_id==user.allfavData[i].id){
								user.allfavData[i].ifshow = !msg.isFans;
								break;
							}
						}
					}
					user.shopsShow = true;
					user.showShop = false;	
					
					$timeout(function() {
						$window.scrollTo(0,msg.scrollTop);
					},100);
				
			});
			$scope.$on('closeGoods',function(evt,msg) {
					document.title = "粉店 -喵喵熊";
					user.shopsShow = true;
					user.showShop = false;
					$timeout(function() {
						$window.scrollTo(0,user.scrollTop);
					},100);
		
            });
           
			getlist(1);
           // var maxNum = 200; //最大加载次数
            var range = 200; //距离下边界50px
            var num = 1;
            var totalHeight = 0;

            $scope.$on('scroll',function(evt,msg) {
                var scrollPos = $(window).scrollTop();
                var docHeight = msg.docHeight;
                var winHeight = $(window).height();  
                totalHeight = msg.totalHeight;
                if(docHeight - range <= totalHeight && user.allfavData.length != 0 && num != user.listnums) {
                    //var offset = num*12;
					//console.log(user.allfavData)
                    getlist(num+1);
                    num++;
                }
            });	
	}])
	
})