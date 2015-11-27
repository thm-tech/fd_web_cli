'use strict';

define(['angular','app','directives/doimg','directives/lazyload','services/checkcookie'], function(angular,app) {
    app.controller('shopDelCtrl',['$scope','$rootScope','$http','$q','$timeout','$interval','$window','$sce','hascookie',
        function($scope,$rootScope,$http,$q,$timeout,$interval,$window,$sce,hascookie) {
            var PER_GOODS_NUM = 18;
            var PER_CUS_FIT = 6;  //每次加载客户秀数量
            var RANGE = 0;
            var host = $rootScope.proxyUrl,
                chatHost = $rootScope.chatProxyUrl;
            var shopInfoUrl = host + '/user/shop/info',
                shopNameUrl = host + '/user/shop/name',
                actUrl = host + '/user/shop/activity',
                goodsUrl = host + '/user/goods',
                customerNumUrl = chatHost + '/chat/shops/usernum';
            var goodsDtUrl = host + '/user/goods/info',
                cusFitUrl = host + '/user/goods/fit',
                imgInfoUrl = host + '/img/info',
                favGoodsUrl = host + '/user/favorite/diff',
                collectUrl = host + '/user/goods/concern';
            var shop = $scope.shop = {};
            var _shop = {};
            var goods = $scope.goods = {};
            var goods_id = 0;
            var fromHome = false;
            shop.showShop = false;
            //响应进店事件
            $scope.$on('intoShop', function(evt,msg) {
                emit('recv');
                console.log('intoShop');
//                console.log('scrolltoppppppp,' + msg.scrollTop);
                _shop = msg;
                shop.name = _shop.sname;
                if(_shop.fromChat) {
                    shop.showShop = true;
                    shop.goods = [];
                }
                if(_shop.gid) {
                    shop.showShop = false;
                    shop.showGoods = !shop.showShop;
                    fromHome = true;
                    console.log('giddddd,' + _shop.gid);
                    goods_id = _shop.gid;
//                    collectUrl = collectUrl + '?gid=' + _shop.gid;
                    shop.showGoodsDel(goods_id);
                }
                else {
                    shop.showShop = true;
                    shop.showGoods = !shop.showShop;
                    getShopData();
                    document.title = shop.name + '-喵喵熊';
                }
            });
            var newGoodsTerm = 7*24*3600*1000; //1周毫秒数
            //当前时间
            var getCurTimeStamp = function() {
                return Date.parse(new Date());    
            };
            //日期时间转换为时间戳
            var timeToStamp = function(datetime) {
                var _datetime = datetime.replace(/-/g,'/');
                return Date.parse(new Date(_datetime));
            };
            //获取商店相关数据
            var getShopInfo = function() {
                $http({
                    url:shopInfoUrl,
                    method:'GET',
                    params: {'sid':_shop.sid}
                })
                .success(function(data) {
                    if(data.err == 0) {
                        shop.info = data.info;
                        $scope.attention = shop.info.isFans;
                    }
                })
                .error();
            };
            var getShopData = function() {
//                getShopName();
//                getFansNum();
//                getCmNum();
                getShopInfo();
                getGoodsData(_shop.sid,0,PER_GOODS_NUM);
            };
            //获取商店名称
            var getShopName = function() {
                $http({
                    url:shopNameUrl,
                    method:'GET',
                    params: {'sid':_shop.sid}
                })
                .success(function(data) {
                    if(data.err == 0) {
                        shop.name = data.shopName;
                    }
                })
                .error();
            };
            //获取商店粉丝数
            var getFansNum = function() {
                $http({
                    url:fansUrl,
                    method:'GET'
                })
                .success(function(data) {
                    if(data.is_success) {
                        shop.fansNum = data.total_num;
                    }    
                })
                .error();
            };
            //获取商店在逛人数
            var getCmNum = function() {
                $http({
                    url:cmNumUrl,
                    method:'GET'
                })
                .success(function(data) {
                    if(data.err == 0) {
                        shop.cmNum = data.count;
                    }    
                })
                .error();
            };
            shop.goods = [];
            shop._goods = [];
            shop.noMoreGoods = false;
            //获取商店商品数据
            var getGoodsData = function(shop_id,offset,count) {
                $http({
                    url:goodsUrl,
                    method:'GET',
                    params:{'sid':shop_id,'offset':offset,'count':count}
                })
                .success(function(data) {
                    if(data.err == 0) {
                        if(data.goodsList.length < PER_GOODS_NUM) {
                            shop.noMoreGoods = true;
                        }
                    for(var i=0,len = data.goodsList.length; i<len; i++) {
                        if(getCurTimeStamp() - timeToStamp(data.goodsList[i].time) < newGoodsTerm) {
                            data.goodsList[i].newGoods = true;
                        }
                        else {
                            data.goodsList[i].newGoods = false;    
                        }
                    }
                    shop.goods = shop.goods.concat(data.goodsList);
                    shop._goods = data.goodsList;
                    shop.goodsLoading = !shop.noMoreGoods;
                    }
                })
                .error();
            };
            //获取商家活动数据
            shop.activities = [];
            shop._actList = [];
            var getActData = function() {
                $http({
                    url:actUrl,
                    method:'GET',
                    params:{'sid':_shop.sid}
                })
                .success(function(data) {
                    if(data.err == 0) {
                        var maxWidth=756;
                        var res;
                        var re = new RegExp("height:(.*?)px; width:(.*?)px", ["g"]);
                        
                        for(var i=0,len=data.actList.length; i<len; i++) {
                            var html = data.actList[i].content;
                            while (res = re.exec(html)) {
                                if (res[2] > maxWidth) {
                                    var nw = maxWidth;
                                    var nh = res[1] * maxWidth / res[2];
                                    html = html.replace(res[0], "height:" + String(nh) + "px; width:" + String(nw) + "px")
                                }
                            }
                            data.actList[i].content = $sce.trustAsHtml(html);
                            data.actList[i].bt = data.actList[i].bt.split(' ')[0];
                            data.actList[i].et = data.actList[i].et.split(' ')[0];
                        }
                        shop.activities = data.actList;
                    }
                })
                .error();
            };
            shop.slides = [];
            var _slides = [];
            shop.imgInterval = 5000;//5s
            shop.noWrapSlides = false;
            var getShopIntro = function() {
                if(shop.info.picList != 0 && shop.slides.length == 0) {
                    for(var i=0,len=shop.info.picList.length; i<len; i++) {
                        shop.slides.push({
                            img:shop.info.picList[i]
                        });
                    }
//                        shop.slides = _slides;
//                        _slides = [];
                }
                var lng = shop.info.long;
                console.log('lng,' + lng);
                console.log('shop address,' + shop.info.lat + '/' + shop.info.long);
                $scope.mapOptions = {
                    ngCenter: {
                        lat:parseFloat(shop.info.lat),
                        lng:parseFloat(shop.info.long)
                    },
                    marker: new BMap.Marker(new BMap.Point(shop.info.long,shop.info.lat)),
                    ngZoom:18,
                    toolbar: true,	
                    scrollzoom: true,
                    maptype: true,
                    overview: true,
                    locatecity: false,
                    resizeEnable: false,
                };
            }; 
        $scope.setZoomMessage = function (zoom) {
            $scope.zoomMessage = 'You just zoomed to ' + zoom + '!';
        };
            $scope.openMarkerInfo = function (e, marker) {
                e.preventDefault();
                e.stopPropagation();
                $scope.currentMarker = marker;
                $scope.currentMarkerLat = marker.getPosition().lat;
                $scope.currentMarkerLng = marker.getPosition().lng;
                $scope.shopMap.addOverlay($scope.myInfoWindow);
                $scope.shopMap.openInfoWindow($scope.myInfoWindow, marker.getPosition());
                
            };
            $scope.setMarkerPosition = function (marker, lat, lng) {
                marker.setPosition(new BMap.Point(lng, lat));		
            };

            shop.interest = function() {
                if(hascookie.check('cm')) {
                var attentionUrl = host + '/user/shop/concern?sid=' + _shop.sid;
                if($scope.attention) {
                    console.log('delete interest');
                    $scope.attention = !$scope.attention;
                    $http({
                        url:attentionUrl,
                        method:'DELETE'
                    })
                    .success(function(data) {
                        if(data.err == 0) {
                            shop.info.isFans = false;
                            --shop.info.fans;
                        }
                    })
                    .error();
                }
                else {
                    console.log('post interest');
                    $scope.attention = !$scope.attention;
                    $http({
                        url:attentionUrl,
                        method:'POST'
                    }).success(function(data) {
                        if(data.err == 0) {
                            shop.info.isFans = true;                
                            ++shop.info.fans;
                        }
                    })
                    .error();
                }
                }
            };    
            shop.intoChat = function() {
                if(hascookie.check('cm')) {
                emit('_enterShopChannel',_shop.sid);    
                }
            };
            //切换商店tab
            shop.curNav = 'goods';
            shop.modNav = function(curStr) {
                if(hascookie.check('cm')) {
                gNum = 1; 
                aNum = 1;
                if(curStr == shop.curNav) {
                    return;
                }
                shop.curNav = curStr;
                if(curStr == 'activity') {
                    getActData();
                }
                else {
                    getShopIntro();    
                }
                }
            };
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
            shop.pLetter = function() {
                if(hascookie.check('cm')) {
                $scope.$emit('_chatToOwnerChannel',_shop.sid);
                }
            };
            shop.sendShop = function() {
                if(hascookie.check('cm')) {
                var msg = {type:'shop'};
                if(shop.info.picList.length != 0)  {
                    msg.img  = shop.info.picList[0];
                }
                else {
                    msg.img = 'http://img.immbear.com/0cd4d258e246ce247e59addcdc3f925c.png';  //无商家图片时默认图片 
                }
                msg.id = _shop.sid;
                msg.name = _shop.sname;
                $scope.$emit('_sendObjChannel',msg);
                }
            };
            shop.sendGoods = function(id,name,imgUrl) {
                if(hascookie.check('cm')) {
                var msg = {type:'goods',id:id,name:name,img:imgUrl};
                $scope.$emit('_sendObjChannel',msg);
                }
            };
            //关闭商店
            shop.close = function() {
                if(hascookie.check('cm')) {
                if(_shop.idx != undefined) {
                    var closeData = {idx:_shop.idx,fansNum:shop.info.fans,isFans:shop.info.isFans,cmCount:shop.info.customers,scrollTop:_shop.scrollTop};
                    emit('closeShop',closeData);
                }
                else {
                    var closeData = {shop_id:_shop.sid,fansNum:shop.info.fans,isFans:shop.info.isFans,cmCount:shop.info.customers};
                    emit('closeShop',closeData);
                }
                }
            };
            shop.showGoodsDel = function(gid) {
                if(hascookie.check('cm')) {
                goods_id = gid;
                shop.scrollTop = $(window).scrollTop();
                console.log('scrollTop,' + shop.scrollTop);
                shop.showShop = false;
                shop.showGoods = !shop.showShop;
                getGoodsDt(gid);
                getFavGoods();
                getCusFit(gid,0,PER_CUS_FIT);
                }
            };
            goods.imgInterval = 5000;
            goods.noWrapSlides = false;
            var getGoodsDt = function(gid) {
                $http({
                    url:goodsDtUrl,
                    method:'GET',
                    params:{gid:gid}
                })
                .success(function(data) {
                    goods.slides = [];
                    if(data.err == 0) {
                        goods.info = data.info;
                        _shop.sid = goods.info.shop_id;
                        document.title = goods.info.desp + '-喵喵熊';
                        if(goods.info.picList.length != 0) {
                            for(var i=0,len=goods.info.picList.length; i<len; i++) {
                                goods.slides.push({
                                    img:goods.info.picList[i]    
                                });
                            }
                        }
                        goods.info.brandName = goods.info.brandName ? goods.info.brandName : '-';
                        goods.info.detail = goods.info.detail ? goods.info.detail : '-';
                        goods.info.remark = goods.info.remark ? goods.info.remark : '-';
                        $http({
                            url:customerNumUrl,
                            method:'GET',
                            params:{'shop_id':goods.info.shop_id}
                        })
                        .success(function(data) {
                            if(data.is_success) {
                                goods.customers = data.shop_dict[goods.info.shop_id];
                            }
                            else {
                                goods.customers = 0;    
                            }
                        })
                        .error();
                    }        
                })
                .error();
            };
            var favGoods = [];
            var getFavGoods = function() {
                $http({
                    url:favGoodsUrl,
                    method:'POST',
                    data:{'goodsIDs':[]}
                })
                .success(function(data) {
                    if(data.err == 0) {
                        favGoods = data.addGoodsIDs;
                        for(var i=0,len=favGoods.length; i<len; i++) {
                            if(favGoods[i] == goods_id) {
                                goods.isFav = true;
                                $scope.favorite = goods.isFav;//是否收藏flag
                                break;
                            }
                            else {
                                goods.isFav = false;    
                                $scope.favorite = goods.isFav;
                            }
                        }
                    }
                })
                .error();
            };
            goods.customerFit = [];
            goods._customerFit = [];
            goods.heightArr = [];
            goods.noCusFit = false;
            var getCusFit = function(gid,offset,count) {
                $http({
                    url:cusFitUrl,
                    method:'GET',
                    params:{gid:gid,offset:offset,count:count}
                })
                .success(function(data) {
                    var imgUrlDt = data.picList;
                    if(data.err == 0) {
                        if(data.picList.length < PER_CUS_FIT) {
                            goods.cusFitLoading = false;
                        }
                        goods._customerFit = data.picList;
                        goods.customerFit = goods.customerFit.concat(data.picList);
                        if(goods.customerFit.length == 0) {
                            goods.noCusFit = true;
                        }
                    }    
                })
                .error();
            };
            goods.collectGoods = function() {
                if(hascookie.check('cm')) {
                if($scope.favorite) {
                    $scope.favorite = !$scope.favorite;
                    $http({
                        url:collectUrl + '?gid=' + goods_id,
                        method:'DELETE',
                    })     
                    .success(function(data) {
                        if(data.err == 0) {
                            goods.isFav = false;    
                            --goods.info.attention_count;
                        }
                    })
                    .error();
                }
                else {
                    $scope.favorite = !$scope.favorite;
                    $http({
                        url:collectUrl + '?gid=' + goods_id,
                        method:'POST',
                    })     
                    .success(function(data) {
                        if(data.err == 0) {
                            goods.isFav = true;
                            ++goods.info.attention_count;
                        }    
                    })
                    .error(); 
                }
                }
            };
            goods.pLetter = function() {
                if(hascookie.check('cm')) {
                $scope.$emit('_chatToOwnerChannel',_shop.sid);
                }
            }; 
            goods.sendGoods = function() {
                if(hascookie.check('cm')) {
                var msg = {type:'goods',id:goods.info.id,name:goods.info.desp,img:goods.info.picList[0]};
                $scope.$emit('_sendObjChannel',msg);
                }
            };
            goods.intoShop = function() {
               // emit('goodsToShop',);   
                if(shop.info) {
                    console.log('not get shop,' + shop.scrollTop);
                    shop.showShop = true;
                    shop.showGoods = !shop.showShop;
                    document.title = _shop.sname + '-喵喵熊'; 
                    $timeout(function() {
                        $window.scrollTo(0,shop.scrollTop);
                    },100);
                } else {
                    console.log('get shop');
                    shop.showShop = true;
                    shop.showGoods = !shop.showShop;
                    getShopData();
                    document.title = _shop.sname + '-喵喵熊';
                }
            }
//            goods.curImg = ; //当前放大图片
            goods.showLarge = false;
            goods.largeSrc = '';
            goods.dealImg = function(url,idx) {
                if(hascookie.check('cm')) {
                console.log('deal image');
                if(idx == goods.curImg) {
                    goods.closeLarge();    
                }
                else {
                    goods.noLast = !!idx ? false : true;
                    goods.noNext = idx == (goods.customerFit.length -1) ? true : false;
                    goods.curImg = idx;
                    goods.showLarge = true;   
                    goods.largeSrc = url + '@500w_500h_0e_1l';
                }
                }
            };
            goods.lastImg = function() {
                if(hascookie.check('cm')) {
                if(goods.noLast) {
                    return false;
                }
                goods.noNext = false;//执行了上一个,下一个一定有
                goods.largeSrc = goods.customerFit[--goods.curImg] + '@500w_500h_0e_1l';
                console.log('last image,' + goods.curImg);
                if(goods.curImg == 0) {
                    console.log('no last');
                    goods.noLast = true;
                }
                }
            };
            goods.nextImg = function() {
                if(hascookie.check('cm')) {
                if(goods.noNext) {
                    return false;
                }
                goods.noLast  = false;  //理由同上
                goods.largeSrc = goods.customerFit[++goods.curImg] + '@500w_500h_0e_1l';
                console.log('next image,' + goods.curImg);
                if(goods.curImg == goods.customerFit.length-1) {
                    console.log('no next');
                    goods.noNext = true;
                }
                }
            };
            goods.closeLarge = function() {
                goods.curImg = null;
                goods.showLarge = false;        
            };
            goods.close = function() {
                if(hascookie.check('cm')) {
                if(fromHome) {
                    emit('closeGoods',{id:goods_id,isFav:goods.isFav});
                }
                else {
                    shop.showShop = true;    
                    shop.showGoods = !shop.showShop;
                    document.title = _shop.sname + '-喵喵熊'; 
                    $timeout(function() {
                        $window.scrollTo(0,shop.scrollTop);
                    },100);
                }
                }
            };
            var gNum = 1,
                aNum = 1;
            shop.goodsLoading = true;
            shop.actLoading = true;
            var cnum = 1;
            $scope.$on('scroll',function(evt,msg) {
                if(shop.showShop) {
                    if(shop.curNav == 'goods') {
                        if(msg.docHeight - RANGE <= msg.totalHeight && shop._goods.length != 0) {
                            console.log('load shop goods');
                            shop.goodsLoading = true;
                            var offset = gNum * PER_GOODS_NUM;
                            getGoodsData(_shop.sid,offset,PER_GOODS_NUM);
                            gNum++;
                        }
                    }
                    else if (shop.curNav == 'activity') {
                        if(msg.docHeight - RANGE <= msg.totalHeight && shop._actList.length != 0 ) {
                            console.log('load shop act');
                            shop.actLoading = true;
                            var offset = aNum * 5;
                            getActData(offset,5,false);
                            aNum++;
                        }
                    }
                } else {
                    if(msg.docHeight - RANGE <= msg.totalHeight && goods._customerFit.length != 0) {
                        goods.cusFitLoading = true;
                        var offset = cnum * PER_CUS_FIT;
                        getCusFit(goods_id,offset,PER_CUS_FIT);
                        cnum ++;
                    }    
                }
            });    
        }]);
    });
