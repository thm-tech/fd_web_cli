'use strict';

define(['angular','app','directives/doimg','directives/lazyload','directives/repeatemit','services/checkcookie'], function(angular,app) {
    app.controller('shopsCtrl',['$scope','$rootScope','$http','$window','$timeout','$interval','$q','$stateParams','$location','hascookie',
        function($scope,$rootScope,$http,$window,$timeout,$interval,$q,$stateParams,$location,hascookie) {
            var PER_SHOP_NUM = 10;    //每次滚动加载商店数
            var RANGE = 0;           //滚动条距离底部范围
            var MAX_NUM = 5;          //每页最大加载次数
            var MAX_PAGE_NUM = 5;     //最大分页显示数
            var ITEMS_PER_PAGE = 50;  //每页最多显示商店数量
            var TITLE = '喵喵熊 -边逛边聊';
            document.title = TITLE;

            var user = $scope.user = {};

            var host = $rootScope.proxyUrl,
            cateUrl = host + '/user/category',        //商店类别
            cityUrl = host + '/user/city',            //城市类别
            shopsUrl = host + '/user/shop',           //商店列表
            searchUrl = host + '/user/shop/search',   //搜索商店
            favShopsUrl = host + '/user/fans/diff',   
            goodsInfoUrl = host + '/user/goods/info',
            shopNameUrl = host + '/user/shop/name',
            shopActUrl = host + '/user/activity',
            actDelUrl = host + '/userweb/activity';
            var cityParam = $stateParams.city || null,  //城市
                wParam = $stateParams.w || null,        //搜索
                pageParam = $stateParams.page || null;  //页数

            user.curCity = {name:'合肥',id:1048577}; //默认城市:合肥
            user.cateList = [];         //商品分类
            user.shopList = [];         //首页商店列表
            user.allshopsData = [];     //每页的商店加载列表
            /*
            (function getCateList() {
                $http.get(cateUrl)
                .success(function(data) {
                    if(data.err == 0)
                        user.cateList = data.category;
                    }
                })
                .error();
            })();*/
            
            (function getCityList() {
                $http({
                    url:cityUrl,
                    method:'GET'
                })
                .success(function(data) {
                    if(data.err == 0) {
                        user.cityList = data.cityList;
                        if(cityParam) {
                            for(var i=0,len=user.cityList.length; i<len; i++) {
                                if(cityParam == user.cityList[i].id) {
                                    user.curCity = user.cityList[i];
                                    $scope.$emit('changeHome',user.curCity.id);
                                    break;
                                }
                            }
                        }
                        if(wParam) {
                            user.searchInput = wParam;
                            console.log('searchhhhhhhhhhhh');
                            $http({
                                url:searchUrl,
                                method:'GET',
                                params:{'name':wParam,'city':user.curCity.id,'offset':0,'count':PER_SHOP_NUM}
                            })
                            .success(shopsuccess)
                            .error();
                    
                        }
                        else {
                            getShopList(0,user.curCity.id,0,PER_SHOP_NUM);
                        }
                        /*
                        if(pageParam) {
                            user.curPage = pageParam;
                            $scope.selectPage(user.curPage);                        
                        }
                        else {
                        }
                        */
                        getShopAct();
                    }
                })
                .error();
             })();
            var getShopAct = function() {
                $http({
                    url: shopActUrl,
                    method: 'GET',
                    params: {city:user.curCity.id,offset:0,count:3}
                })
                .success(function(data) {
                    if(data.err == 0) {
                        if(data.actList.length == 0) {
                            user.noAct = true;
                        }
                        else {
                            user.noAct = false;
                            for(var i=0,len=data.actList.length; i<len; i++) {
                                data.actList[i].bt = data.actList[i].bt.split(' ')[0];
                                data.actList[i].et = data.actList[i].et.split(' ')[0];
                            }
                            user.actList = data.actList;
                        }
                    }
                })
                .error();
            };
            user.mCity = false;
            user.mCity = function() {
                user.cityHover = !user.cityHover;
            };
            //选择城市
            user.selectCity = function(city) {
                user.curCity = city;
                cityParam = city.id;
                $location.path('/customer/account/shops').search({city:city.id});
            };
            //搜索商店
            user.search = function() {
                console.log('search');
                if(!user.searchInput) {
                    if(cityParam) {
                        $location.path('/customer/account/shops').search({city:cityParam});        
                    }    
                    else {
                        $location.path('/customer/account');    
                    }
                    return;
                }
                if(cityParam) {
                    $location.path('/customer/account/shops').search({city:cityParam,w:user.searchInput});    
                }
                else {
                    $location.path('/customer/account/shops').search({w:user.searchInput});    
                }
                console.log('ssssssssss,' + user.searchInput);
            };
            var newGoodsTerm = 7*24*3600*1000; //1周毫秒数
            //获取当前时间戳
            var getCurTimeStamp = function() {
                return Date.parse(new Date());    
            };
            //日期时间转换为时间戳
            var timeToStamp = function(datetime) {
                var _datetime = datetime.replace(/-/g,'/');
                return Date.parse(new Date(_datetime));
            };
            user.curPage = 1;
            user.maxSize = MAX_PAGE_NUM;
            user.itemsPerPage = ITEMS_PER_PAGE; //每页最多加载商店数量
            user.totalCount = 0;//累计加载总数
            //翻页
            $scope.selectPage = function(page) {
//                evt.stopPropagation();
                if(hascookie.check('cm')) {     
                user.continueLoading = false;
                user.showPagi = false;
                console.log('page,' + page);
                var _offset = (page-1)*user.itemsPerPage;
                user.shopList = [];
                user.allshopsData = [];
                user._allshopsData = [];
                num = 1;
                user.loadComplete = true;
                getShopList(0,user.curCity.id,_offset,PER_SHOP_NUM);
                }
            };
            user.noShops = false;
            //获取符合条件的商店数据
            var getShopList = function (category,city,offset,count) {    
                if(typeof $stateParams.w == 'undefined') {    
                $http({
                    url: shopsUrl,
                    method: 'GET',
                    params: {
                             'category': category,
                             'city':city,
                             'offset':offset,
                             'count':count
                            }
                })
                .success(shopsuccess)
                .error(function(data) {
                    user.continueLoading = false;
                });
                }
                else {
                    $http({
                        url:searchUrl,
                        method:'GET',
                        params: {
                            'name':wParam,
                            'city':user.curCity.id,
                            'offset':offset,
                            'count':PER_SHOP_NUM
                        }
                    })
                    .success(shopsuccess)    
                    .error();
                }
            };
            //成功请求商店列表回调
            var shopsuccess = function(data) {
                user.shopTotal = data.total_num;
                user.totalPages = parseInt((user.shopTotal+user.itemsPerPage-1)/user.itemsPerPage);
                
                if(data.shopList.length == 0 && user.allshopsData.length == 0) {
                    user.noShops = true;
                    user.showPagi = false;
                }
                else {
                    user.noShops = false; 
                    user.showPagi = true;
                }
                user.shopList = data.shopList;
                if(data.err == 0 && data.shopList.length != 0) {
                    if(data.total_num == data.shopList.length) {
                        user.continueLoading = false;
                    }
                    user.totalCount += data.shopList.length;
                    $http({
                        url:favShopsUrl,
                        method:'POST',
                        data:{'shopIDs':[]}
                    })
                    .success(favsuccess)
                    .error();
                }
                else {
                    user.continueLoading = false;        
                }
            };
            //成功请求粉店id回调
            var favsuccess = function(data) {
                if(data.err == 0) {
                    user.favShops = data.addShopIDs;
                    var shopIds = [];
                    for(var i=0,len=user.shopList.length; i<len; i++) {
                       shopIds[i] = user.shopList[i].id;     
                    }
                    var goodsUrl = host + '/userweb/shopgoods/' + shopIds.toString();
                    $http({
                        url:goodsUrl,
                        method:'GET'
                    })
                    .success(goodssuccess)
                    .error();
                }
            };
            //成功请求商品数据回调
            var goodssuccess = function(data) {
                user._allshopsData = [];
                for(var i=0,len=user.shopList.length; i<len; i++) {
                    data.shops[i].fansNum = user.shopList[i].fans;    
                    data.shops[i].customersNum = user.shopList[i].customers;
                    for(var j=0,_len=data.shops[i].goods.length; j<_len; j++) {
                        if(getCurTimeStamp()-timeToStamp(data.shops[i].goods[j].time) < newGoodsTerm) {
                            data.shops[i].goods[j].newGoods = true;    
                        }    
                        else {
                            data.shops[i].goods[j].newGoods = false;    
                        }
                    }
                    for(var k=0,__len=user.favShops.length; k<__len; k++) {
                        if(data.shops[i].shop_id == user.favShops[k]) {
                            data.shops[i].isFans = true;
                            break;
                        }
                        else {
                            data.shops[i].isFans = false;
                        }
                    }
                }
                user.allshopsData = user.allshopsData.concat(data.shops);
                user._allshopsData = data.shops;
                console.log('curPageeeeeeee',user.curPage + '-' + user.totalPages);
                /*
                if(user.curPage != user.totalPages) {
                    if(user.allshopsData.length == ITEMS_PER_PAGE) {
                        console.log('11111111111111');
                        user.showPagi = true;
                    }    
                    else {
                        console.log('22222222222222');
                        user.showPagi = false;    
                    }
                }
                else {
                    console.log('lengthhhhhhh,' + user.allshopsData.length);
                    if(user.allshopsData.length == user.shopTotal-((user.curPage-1)*ITEMS_PER_PAGE)) {
                        console.log('333333333333');
                        user.showPagi = true;
                    }    
                    else {
                        console.log('444444444444');
                        user.showPagi = false;    
                    }
                }
                */
            };
            var intoActFlag = true;
            user.showAct = false;
            var bcIntoAct = function(_arg) {
                if(_arg.type == 'list') {
                    $scope.$broadcast('intoAct',{cid:user.curCity.id});
                }
                else if(_arg.type === 'del'){
                    console.log('shopsssssssssssssss,' + _arg);
                    console.log(user.actList);
                    console.log(user.actList[_arg.idx].content);
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
            //点击更多活动
            user.showActList = function() {
                if(hascookie.check('cm')) {     
                user.intoAct();
                bcInterval = $interval(function() {
                    bcIntoAct({type:'list'});
                },300);
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
            //用户粉店动作
            $scope.attentionFlag = true;//关注操作标志
            user.interest = function(shop_id,isFans,idx) {
                if(hascookie.check('cm')) {     
                var attentionUrl = host + '/user/shop/concern?sid=' + shop_id;
                if(!$scope.attentionFlag) {
                    return;
                }
                if(isFans) {
                    $scope.attentionFlag = false;
                    $http({
                        url:attentionUrl,
                        method:'DELETE'
                    })
                    .success(function(data) {
                        if(data.err == 0) {
                            user.allshopsData[idx].isFans = false;
                            --user.allshopsData[idx].fansNum;
                        }
                            $scope.attentionFlag = true;
                    })
                    .error(function(data) {
                        $scope.attentionFlag = true;    
                    });
                }
                else {
                    $http({
                        url:attentionUrl,
                        method:'POST'
                    }).success(function(data) {
                        if(data.err == 0) {
                            user.allshopsData[idx].isFans = true;                
                            ++user.allshopsData[idx].fansNum;
                        }
                            $scope.attentionFlag = true;
                    })
                    .error(function(data) {
                        $scope.attentionFlag = true;
                    });
                }
                }
            };
           
            var num = 1;    //每页滚动加载次数
            var totalHeight = 0;
            user.continueLoading = true;
            user.showPagi = false;
            user.shopsShow = true;
            user.showShop = false;
            //进入商店
            var bcInterval;
            var intoShopFlag = true;
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
                if(hascookie.check('cm')) {     
                if(intoShopFlag) {
                    console.log('intoshopppppppppppp');
                    intoShopFlag = false;
                    countIntoShop(shopObj.sid);
                    _loadShop();
                    bcInterval = $interval(function() {
    //                                console.log('interval');
                                     bcInfoShop(shopObj);
                                     },300);  
                }
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
                    user.showAct = false;
                    user.showShop = true;
                });        
            };
            //广播进店事件
            var bcInfoShop = function(shopObj) {
                var _shop = shopObj;
                _shop.scrollTop = user.scrollTop;
                $scope.$broadcast('intoShop',_shop);        
            };
            //查看商品
            user.showGoods = function(gid,sid,sname,isFans,idx) {
                if(hascookie.check('cm')) {     
                var sgObj = {gid:gid,sid:sid,sname:sname,isFans:isFans,idx:idx};
                user.scrollTop = $(window).scrollTop();//记住滚动条位置
                sgObj.scrollTop = user.scrollTop;
                user._intoShop(sgObj);    
                }
            };
            //发送商店
            user.sendShop = function(id,name) {
                if(hascookie.check('cm')) {     
                var msg = {type:'shop'};
                var shopUrl = host + '/shop/' + id;
                var shopImg = '';
                $http({
                    url:shopUrl,
                    method:'GET'
                })
                .success(function(data) {
                    if(data.pic_url_list.length != 0) {
                        shopImg = data.pic_url_list[0];
                    }
                    msg.img = shopImg;
                    msg.id = id;
                    msg.name = name;
                    $scope.$emit('_sendObjChannel',msg);
                })
                .error();    
                }
            };
            //发送商品
            user.sendGoods = function(sid,id,name,imgUrl) {
                if(hascookie.check('cm')) {     
                var msg = {type:'goods',id:id,name:name,img:imgUrl,sid:sid};
                $scope.$emit('_sendObjChannel',msg);
                }
            };
            //进入聊天室
            user.intoChat = function(id) {
                if(hascookie.check('cm')) {     
                $scope.$emit('_enterShopChannel',id);
                }
            };
            $scope.$on('goodsToShop',function(evt,msg) {
                var sObj = {sid:msg.id,sname:msg.name};
                user._intoShop(sObj);
            });
            //响应用户点击聊天窗(商店或商品)
            $scope.$on('_recvObjChannel',function(evt,msg) {
                console.log('recvObjChannelllllllllllllllll');
                console.log(msg);
                if(msg.type === 'shop') {
                    var sObj = {sid:msg.id,sname:msg.name,fromChat:true};
                    user._intoShop(sObj);
                }
                else if(msg.type === 'goods') {
                    var gObj = {gid:msg.id};
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
                                    user._intoShop(gObj);
                                }
                            })
                            .error();
                        }
                    })
                    .error();
                }
                else if(msg.type === 'act') {
                    var actObj = {id:msg.id};
                    user.chatToAct(actObj);
                }
            });
            $scope.$on('actToShop',function(evt,msg) {
                user.showAct = false;
                user._intoShop(msg);
            });
            user.loadComplete = true; //商店加载完成
            $scope.$on('lastemit',function(evt,msg) {
                user.loadComplete = true;                    
            });
            //监听鼠标滚动事件
            $scope.$on('scroll',function(evt,msg) {
                if(user.shopsShow) {
                    if(user.loadComplete && msg.docHeight - RANGE <= msg.totalHeight && user.shopList.length != 0 && user._allshopsData.length != 0 && num != MAX_NUM) {
                        user.loadComplete = false;
                        console.log('nummmmmmm,' + num);
                        user.continueLoading = true;
//                        user.showPagi = false;
                        var offset = num*PER_SHOP_NUM + (user.curPage-1)*(user.itemsPerPage);
                        getShopList(0,user.curCity.id,offset,PER_SHOP_NUM);
                        num++;
                    } 
                    else if(num == MAX_NUM || user.totalCount == user.shopTotal) {
                        if(user.totalPages >= 1) {
//                            user.showPagi = true;
                        }
                        user.continueLoading = false;
                    }
                }
            });
            //响应关闭商店事件
            $scope.$on('closeShop',function(evt,msg) {
                document.title = TITLE;
                user.shopsShow = true;
                user.showShop = false;
                if(msg.idx !=undefined) {
                    user.allshopsData[msg.idx].fansNum = msg.fansNum;
                    user.allshopsData[msg.idx].isFans = msg.isFans;
                    user.allshopsData[msg.idx].customersNum = msg.cmCount;
                    console.log('scrolllllllllllllltop,' + msg.scrollTop);
                    $timeout(function() {
                        $window.scrollTo(0,user.scrollTop);
                    },100);
                }
                else {
                    for(var i=0,len=user.allshopsData.length; i<len; i++) {
                        if(msg.shop_id == user.allshopsData[i].shop_id) {
                            user.allshopsData[i].fansNum = msg.fansNum;
                            user.allshopsData[i].isFans = msg.isFans;
                            user.allshopsData[i].customersNum = msg.cmCount;
                            break;
                        }    
                    }    
                    $timeout(function() {
                        $window.scrollTo(0,user.scrollTop);
                    },100);
                }
            });
            //响应关闭商品事件
            $scope.$on('closeGoods',function(evt,msg) {
                document.title = TITLE;
                user.shopsShow = true;
                user.showShop = false;
                $timeout(function() {
                    $window.scrollTo(0,user.scrollTop);
                },100);
            });
            //商店js收到进店事件并响应
            $scope.$on('recv',function(evt,msg) {
                $interval.cancel(bcInterval);
                intoShopFlag = true;
            });
    }]);
});
