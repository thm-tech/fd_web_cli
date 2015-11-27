'use strict';

define(['angular','app','directives/ngthumb','directives/doimg','services/checkcookie'], function(angular,app) {
        app.controller('goodsCtrl', ['$scope','$rootScope','$http','$filter','$timeout','FileUploader','$modal','hascookie',function($scope,$rootScope,$http,$filter,$timeout,FileUploader,$modal,hascookie) {
        	document.title = '商品 -喵喵熊';
            var hostname = $rootScope.hostname;
            var host = $rootScope.proxyUrl;
            var chatHost = $rootScope.chatProxyUrl;
            var shop_id = $rootScope.globals.shop_id;
            $scope.curSubnav = 'online';
            $scope.goodsTpl = 'views/merchant/account/goods/online.html';
            $scope.modSubnav = function(evt) {
                if(!hascookie.check('mt')) {
                    console.log('cookieeeeeeeeeeee');
                    return;
                }
                $scope.searchInput = '';
                search = '';//clean search
                $scope.page = {};
                $scope.page.plist_all = [1];
                $scope.page.plist = [];
                $scope.page.curPage = $scope.page.plist_all[0];
                $scope.showDetail = false;
                $scope._showDetail = false;
                this.val = evt.target.attributes.data.value;
                $scope.curSubnav = this.val;
                if(this.val == 'online') {
                    $scope.init(1,1);    
                }
                else if(this.val == 'offline') {
                    $scope.init(1,0);
                }
                $scope.goodsTpl = 'views/merchant/account/goods/' + this.val + '.html';
            };
            //响应子ctrl
            $scope.$on('modelChange', function(evt,msg) {
                console.log('child,' + msg);
                $scope.curSubnav = 'online';
                $scope.init(1,1);
                $scope.goodsTpl = 'views/merchant/account/goods/online.html'; 
            });
            $scope.page = {};
            $scope.page.plist_all = [1];
            $scope.page.curPage = $scope.page.plist_all[0];
            //请求商品
            $scope.init = function (pagenum,statusNum) {
                if(!hascookie.check('mt')) {
                    return;
                }
                var goodsUrl = '';
                console.log('come');
                if (pagenum == 0 || pagenum - 1 == $scope.page.page_num) {
                    return false
                }
                if(search) {
                    goodsUrl = host + '/goods/search' + '?shop_id=' + shop_id + '&offset=' + String(10 * (pagenum - 1)) + '&limit=10&status=' + statusNum + '&input=' + search;
                }
                else {
                    goodsUrl = host + '/goods' + '?shop_id=' + shop_id + '&offset=' + String(10 * (pagenum - 1)) + '&limit=10&status=' + statusNum;
                }
                $scope.goodsCheckedList = [];
                $scope.page.current_page = pagenum;
                $http({
                    url: goodsUrl,
                    method: 'GET'
                }).success(function (data) {
                        $scope.page.curPage = pagenum;
                        $scope.goods = data.goods;
                        angular.forEach($scope.goods,function(data,idx) {
                            $scope.goods[idx].price = $scope.goods[idx].price ? $filter('currency')($scope.goods[idx].price,'￥') : '-'; 
                            $scope.goods[idx].promotion_price = $scope.goods[idx].promotion_price ? $filter('currency')($scope.goods[idx].promotion_price,'￥') : '-'; 
                        });
                        console.log('goods,' + $scope.goods.length);
                        $scope.page.total_num = data.total_num;
                        $scope.page.page_num = Math.ceil($scope.page.total_num / 10);

                        $scope.page.plist_all = new Array($scope.page.page_num);
                        for (var i = 0; i < $scope.page.plist_all.length; i++) {
                            $scope.page.plist_all[i] = i + 1;
                        }

                        if ($scope.page.page_num < 5) {
                            $scope.page.plist = new Array($scope.page.page_num);
                            for (var i = 0; i < $scope.page.plist.length; i++) {
                                $scope.page.plist[i] = i + 1;
                            }
                        } else {
                            $scope.page.plist = new Array(5);
                            for (var i = 0; i < 5; i++) {
                                $scope.page.plist[i] = i + 1;
                            }
                            if ($scope.page.current_page > $scope.page.plist[4]) {
                                if ($scope.page.current_page < $scope.page.page_num - 1) {
                                    for (var i = 0; i < 5; i++) {
                                        $scope.page.plist[i] = $scope.page.plist[i] + $scope.page.current_page - $scope.page.plist[4] + 2;
                                    }
                                } else if ($scope.page.current_page < $scope.page.page_num) {
                                    for (var i = 0; i < 5; i++) {
                                        $scope.page.plist[i] = $scope.page.plist[i] + $scope.page.current_page - $scope.page.plist[4] + 1;
                                    }
                                }
                                else {
                                    for (var i = 0; i < 5; i++) {
                                        $scope.page.plist[i] = $scope.page.plist[i] + $scope.page.current_page - $scope.page.plist[4];
                                    }
                                }
                            }
                        }
                    console.log($scope.page);
                });
            };
            $scope.init(1,1); //请求上架商品的第一页
            $scope.is_current = function (index) {
                if (index == $scope.page.current_page) {
                    return true;
                } else {
                    return false;
                }
            };
            var search = '';
            $scope.searchGoods = function() {
                if(!hascookie.check('mt')) {
                    return;
                }
                var statusNum = 0;
                if($scope.curSubnav == 'publish') {
                    return;
                }
                else if($scope.curSubnav == 'online') {
                    statusNum = 1;
                }
                else {
                    statusNum = 0;
                }
                if($scope.searchInput) {
                    console.log('search,' + typeof $scope.searchInput + ':' + $scope.searchInput);
                    search = $scope.searchInput;
                    $scope.init(1,statusNum);
                } else {
                    search = '';
                    $scope.init(1,statusNum);
                } 
                            
            };
            //跳转到指定页数
            $scope.paging = function(statusNum) {
                if(!hascookie.check('mt')) {
                    return;
                }
                console.log('paginggggggggggggggg,' + $scope.page.plist_all.length);
                if($scope.page.plist_all.indexOf(parseInt($scope.page.pageNum)) == -1) {
                    console.log('noneeeeeeeeeeeeee');
                    $scope.page.pageNum = '';
                    return false; 
                }
                else {
                    $scope.init($scope.page.pageNum,statusNum);
                }
            };
            
            var popDialog = function(ids,msg,statusNum,putStatus) {
                var url = host + '/goods/status';
                ids = ids.toString();
                var modalInstance = $modal.open({
                    animation:true,
                    templateUrl:'views/merchant/account/goods/tpl/confirm.html',
                    controller:['$scope','$modalInstance','$http','msg', function($scope,$modalInstance,$http,msg) {
                        $scope.msg = msg;
                        $scope._confirm = function() {
                            $modalInstance.close();
                        };
                        $scope._cancel = function() {
                            $modalInstance.dismiss('cancel');    
                        };
                    }],
                    resolve:{
                        'msg':function() {
                            return msg;    
                        }      
                    },
                    size:'sm',
                    windowClass:'modal-window',
                }); 
                modalInstance.result.then(function() {
                        $http({
                            url:url,
                            method:'PUT',
                            data:{'ids':ids,'status':putStatus}
                        })
                        .success(function(data) {
                            if(data.is_success) {
                                $scope.init($scope.page.current_page,statusNum);
                                $scope.backList(statusNum);
                            }
                        })
                        .error(function(data) {
                            
                        }); 
                });
                    
            };
            //商品下架
            $scope.offGoods = function(goods_id) {
                if(!hascookie.check('mt')) {
                    return;
                }
                var msg = '确定下架此商品吗?';
                popDialog(goods_id,msg,1,0);
                /*
                var offUrl = host + '/goods/status' ;
                if (window.confirm(msg)) {
                    $http({
                        url:offUrl,
                        method:'PUT',
                        data: {'ids':[goods_id],'status':0}
                    })
                    .success(function(data) {
                        if(data.is_success) {
                            $scope.init($scope.page.current_page,1);
                        }
                    })
                    .error(function(data) {
                        
                    });
                }*/
            };
            //商品上架
            $scope.onGoods = function(goods_id) {
                if(!hascookie.check('mt')) {
                    return;
                }
                var msg = '确定上架此商品吗?';
                popDialog(goods_id,msg,0,1);
                /*
                var onUrl = host + '/goods/status';
                if (window.confirm(msg)) {
                    $http({
                        url:onUrl,
                        method:'PUT',
                        data:{'ids':[goods_id],'status':1}
                    })
                    .success(function(data) {
                        if(data.is_success) {
                            $scope.init($scope.page.current_page,0);    
                        }
                    })
                    .error(function(data) {
                        
                    });
                }*/
            };
            //删除商品
            $scope.delGoods = function(goods_id,statusNum) {
                if(!hascookie.check('mt')) {
                    return;
                }
                var msg = '确定删除此商品吗?';
                popDialog(goods_id,msg,statusNum,2);
                /*
                var delUrl = host + '/goods/status';
                    if(window.confirm(msg)) {
                        console.log('delete');
                        $http({
                            url: delUrl,
                            method: 'PUT',
                            data: {'ids':[goods_id],'status':2}
                        })
                        .success(function(data) {
                            if(data.is_success) {
                                $scope.init($scope.page.current_page,statusNum);
                            }
                        })
                        .error(function(data) {
                            
                        });
                    }*/        
            };
            $scope.goodsCheckedList = [];
            $scope.toggleSel = function(goods_id) {
                if(!hascookie.check('mt')) {
                    return;
                }
                var index = $scope.goodsCheckedList.indexOf(goods_id);
                if (index > -1) {
                    $scope.goodsCheckedList.splice(index,1);
                }
                else {
                    $scope.goodsCheckedList.push(goods_id);
                }
                console.log('goodsCheckedList length,' + $scope.goodsCheckedList.length);
            };
            //全选
            $scope.toggleAll = function() {
                if(!hascookie.check('mt')) {
                    return;
                }
                if ($scope.goodsCheckedList.length != $scope.goods.length) {  //如果不是全选
                    for (var i=0,len=$scope.goods.length; i<len; i++) {
                        $scope.goodsCheckedList[i] = $scope.goods[i].goods_id;
                    }    
                }
                else {
                    $scope.goodsCheckedList = [];    
                }
            };
            //批量下架
            $scope.offBatchGoods = function() {
                if(!hascookie.check('mt')) {
                    return;
                }
                var msg = '确定要下架所选商品吗?';
                var goodsList = $scope.goodsCheckedList;
                popDialog(goodsList,msg,1,0);
                /*
                if(window.confirm(msg)) {
                        $http({
                            url: host + '/goods/status',
                            method: 'PUT',
                            data: {'ids':$scope.goodsCheckedList.toString(),'status': 0}
                        })
                        .success(function(data) {
                            if (data.is_success) {
                                $scope.init($scope.page.current_page,1);    
                                $scope.goodsCheckedList = [];
                            }
                        })
                        .error(function(data) {
                            
                        });    
                }*/
            };
            //批量上架
            $scope.onBatchGoods = function() {
                if(!hascookie.check('mt')) {
                    return;
                }
                var msg = '确定要上架所选商品吗?'; 
                var goodsList = $scope.goodsCheckedList;
                popDialog(goodsList,msg,0,1);
                /*
                if(window.confirm(msg)) {
                        $http({
                            url: host + '/goods/status',
                            method: 'PUT',
                            data: {'ids':$scope.goodsCheckedList.toString(),'status': 1}
                        })
                        .success(function(data) {
                            if (data.is_success) {
                                $scope.init($scope.page.current_page,0);
                                $scope.goodsCheckedList = [];
                            }
                        })
                        .error(function(data) {
                            
                        });
                }*/
            };
            //批量删除
            $scope.delBatchGoods = function(statusNum) {
                if(!hascookie.check('mt')) {
                    return;
                }
                var msg = '确定要删除所选商品吗?'; 
                var goodsList = $scope.goodsCheckedList;
                popDialog(goodsList,msg,statusNum,2);
                /*
                if(window.confirm(msg)) {
                        $http({
                            url: host + '/goods/status',
                            method: 'PUT',
                            data: {'ids':$scope.goodsCheckedList.toString(),'status':2}
                        })
                        .success(function(data) {
                            if (data.is_success) {
                                $scope.init($scope.page.current_page,statusNum);
                                $scope.goodsCheckedList = [];
                            }
                        })
                        .error(function(data) {
                            
                        });    
                }*/
            };
            /******显示商品详情部分********/
            $scope.detailTpl = 'views/merchant/account/goods/detail/basicInfo.html'; //商品信息页面
            $scope.curDetail = 'basic';
            $scope.goodsInfo = {};//商品基本信息
            $scope.edit = '';
            $scope.txFocus = function(evt) {
                if(!hascookie.check('mt')) {
                    return;
                }
               var val = evt.target.attributes.data.value;
                $timeout(function() {
                    $scope.edit = val;    
                },300);
            };
            $scope.txBlur = function() {
                if(!hascookie.check("mt")) {
                    return;
                }
                console.log('blurrrrrrrrrrrr');
                $timeout(function() {
                    $scope.edit = '';    
                },200);
            };
            //修改商品基本信息
            $scope.saveBasic = function(evt,goodsAttr) {
                if(!hascookie.check('mt')) {
                    return;
                }
                var val = evt.target.attributes.data.value;   //修改商品属性值
                console.log('vallllllllll,' + val);
                var goodsEdit  = {shop_id:shop_id};
                goodsEdit[val] = goodsAttr;
                
                $http({
                    url:host + '/goods/' + $scope.goodsInfo.goods_id,
                    method:'PUT',
                    data:angular.toJson(goodsEdit)
                }).success(function(data) {
                    if(data.is_success) {
                        $scope.saveInfo = '保存成功';
                        $scope.saved = val;
                        $timeout(function() {
                            $scope.saved = '';
                        },2000);
                        if(val === 'price' || val === 'promotion_price') {
                            $scope.goodsInfo[val] = $filter('currency')($scope.goodsBasic[val],'￥'); 
                        } else {
                            $scope.goodsInfo[val] = $scope.goodsBasic[val]; 
                        }
                        console.log('change success');
                    }
                    else {
                        $scope.saveInfo = '保存失败';
                        $scope.saved = val;
                        $timeout(function() {
                            $scope.saved = '';    
                        },2000);
                        getBasic($scope.goodsInfo.goods_id);
                    }
                })
                .error(function(data) {
                    console.log('save failed');
                        $scope.saveInfo = '保存失败';
                        $scope.saved = val;
                        $timeout(function() {
                            $scope.saved = '';    
                        },2000);
                        getBasic($scope.goodsInfo.goods_id);
                });
            };
            //请求商品基本信息
            var getBasic = function(goods_id) {
                console.log('goods_id,' + goods_id);
                $http.get(host + '/goods/' + goods_id)
                .success(function(goodsBasic) {
                        $scope.goodsBasic = goodsBasic;
                        angular.forEach($scope.goodsBasic,function(value,key) {
                            if(!value && key !== 'basic_info') {
                                $scope.goodsBasic[key] = '-';
                            }
                            /*
                            if(value && (key === 'price' || key === 'promotion_price')) {
                                $scope.goodsBasic[key] = $filter('currency')($scope.goodsBasic[key],'￥'); 
                                console.log('price promotion_price,' + $scope.goodsBasic[key]);
                            }
                            */
                        });
                        if(angular.fromJson($scope.goodsBasic.basic_info).length) {
                            console.log('$scope.goodsBasic.basic_info.length,' + angular.fromJson($scope.goodsBasic.basic_info).length);
                            $scope.goodsBasic.basic_info = angular.fromJson($scope.goodsBasic.basic_info);
                            console.log('basic_info,' + $scope.goodsBasic.basic_info[0].paramsName);
                        }
                        else {
                            $scope.goodsBasic.basic_info = [];    
                        }
                }).error(function(data) {console.log('data,' + data);});
            };
            //请求商品图片
            var getImage = function(goods_id) {
                var imgUrl = host + '/goods/' + goods_id + '/image';
                $http.get(imgUrl)
                .success(function(goodsImage) {
                    $scope.imgInfo = goodsImage;
                })
                .error(function(data) {
                    
                });
                console.log('goods_id,' + goods_id);
            };

            var uploader = $scope.uploader = new FileUploader({     //初始化图片上传配置
                    url: chatHost + '/file/uploader',
                    autoUpload: true                  
               });

               //filter 文件格式过滤

           uploader.filters.push({
                    name: 'imageFilter',
                    fn: function(item,options) {
                       var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                       return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                    }
            });
           //图片上传成功
            uploader._onSuccessItem = function(fileItem,resData,status,headers) {
                uploader.queue.splice(0,1);
                console.log('successuploadddddd,' + resData.url); 
                var imgUrl = host + '/goods/' + $scope.goodsInfo.goods_id + '/image';
                if(resData.url) {
                    $scope.imgInfo.imgs.unshift(resData.url);
                    var imgList = $scope.imgInfo.imgs.toString();
                    var putData = {pic_url_list:imgList};
                    $http({
                        url:imgUrl,
                        method:'PUT',
                        data:putData
                        }).success(function(resData) {
                        if(resData.is_success) {
                           console.log('upload success'); 
                        }
                    }).error(function() {
                        
                    });
                }
            };
            //图片上传失败
            uploader._onErrorItem = function() {
                    console.log('erroruploadddddd');
               };
            var imgIndex = 0; //当前放大的图片index
            $scope.large = false;
            $scope.largeSrc = '';
            $scope.enlarge = function(imgsrc,index) {
                console.log('large');
                $scope.noLast = false;
                $scope.noNext = false;
                if(index == 0) {
                    $scope.noLast = true;
                }
                if(index == $scope.imgInfo.imgs.length - 1) {
                    $scope.noNext = true;
                }
                imgIndex = index;
                $scope.large = true;
                $scope.largeSrc = imgsrc + '@650w_650h_0e_1l';
            };
            $scope.lastImg = function() {
                console.log('index,' + imgIndex);
                if($scope.noLast) {
                    return false;        
                }
                imgIndex = imgIndex - 1;
                if(imgIndex == 0) {
                    $scope.noLast = true;
                }
                $scope.noNext = false;
                $scope.largeSrc = $scope.imgInfo.imgs[imgIndex] + '@650w_650h_0e_1l';     
            };
            $scope.nextImg = function() {
                console.log('index,' + imgIndex);
                if($scope.noNext) {
                    return false; 
                }
                imgIndex = imgIndex + 1;
                if(imgIndex == $scope.imgInfo.imgs.length - 1) {
                    $scope.noNext = true;
                }
                $scope.noLast = false;
                $scope.largeSrc = $scope.imgInfo.imgs[imgIndex] + '@650w_650h_0e_1l';     
            };
            $scope.closeLarge = function() {
                $scope.large = false;        
            };
            
               //删除商品图片
            var popDialog1 = function(index,url,msg) {
                var modalInstance = $modal.open({
                    animation:true,
                    templateUrl:'views/merchant/account/goods/tpl/confirm.html',
                    controller:['$scope','$modalInstance','msg', function($scope,$modalInstance,msg) {
                        $scope.msg = msg;
                        $scope._confirm = function() {
                            $modalInstance.close();
                        };
                        $scope._cancel = function() {
                            $modalInstance.dismiss('cancel');    
                        };

                    }],
                    resolve:{
                        'msg':function() {
                            return msg;    
                        }
                    },
                    size:'sm',
                    windowClass:'modal-window'
                });   
                modalInstance.result.then(function() {
                    $scope.imgInfo.imgs.splice(index,1);
                    var imgList = $scope.imgInfo.imgs.toString();
                    var putData = {pic_url_list:imgList};
                    $http({
                        url:url,
                        method:'PUT',
                        data:putData
                    }).success(function(resData) {
                        if(resData.is_success) {
                            console.log('del success'); 
                        }
                    }).error(function() {
                    
                    });
                });
            };
            $scope.delImg = function(index) {
                if(!hascookie.check('mt')) {
                    return;
                }
                var imgUrl = host + '/goods/' + $scope.goodsInfo.goods_id + '/image';
                var msg = '确定删除此图片吗?';
                popDialog1(index,imgUrl,msg);
                /*
                if(window.confirm(msg)) {
                    $scope.imgInfo.imgs.splice(index,1);
                    var imgList = $scope.imgInfo.imgs.toString();
                    var putData = {pic_url_list:imgList};
                        $http({
                            url:imgUrl,
                            method:'PUT',
                            data:putData
                        }).success(function(resData) {
                            if(resData.is_success) {
                                console.log('del success'); 
                            }
                        }).error(function() {
                        
                        });
                }*/
            };
            //请求商品关注度信息
            $scope.attention = {};  //商品关注信息
            $scope.fansInfo = {};   //粉丝关注信息
            $scope.maxNum = 8;      //关注粉丝最多显示数
            $scope.isPackUp = true; //粉丝是否收起
            $scope.curFans = 0;
            $scope.showAll = function() {
                console.log('fans_total,' + $scope.fansInfo.total_num);
                $scope.maxNum = $scope.fansInfo.total_num;
                $scope.isPackUp = false;
            };
            $scope.showFansData = function(index) {
                if(!hascookie.check('mt')) {
                    return;
                }
                getFansData(index);
                $scope.curFans = $scope.fansInfo.fans[index];
            };
            $scope.hideFansData = function() {
                $scope.curFans = 0;
            };
            $scope.packUp = function() {
                $scope.maxNum = 8;
                $scope.isPackUp = true
            };
            $scope.curPage = 0;
            $scope.noLast = false;
            $scope.noNext = false;
            var getAttention = function(goods_id) {
                getFansInfo(goods_id,1,9);
            };
            var getFansInfo = function(goods_id,pageNum,limit) {
                    var offset = 9*(pageNum-1);
                    $http.get(host + '/goods/' + goods_id + '/fans?details=' + true + '&offset=' + offset + '&limit=' + limit)
                    .success(function(resData) {
                            $scope.fansInfo =  resData;
                            $scope.curPage = pageNum;
                            if ($scope.curPage == 1) {
                                console.log('curPage111');
                                $scope.noLast = true;
                                if($scope.curPage*limit >= $scope.fansInfo.total_num) {
                                    console.log('next');
                                    $scope.noNext = true;    
                                }
                                else {
                                    $scope.noNext = false;    
                                }
                            }
                            else {
                                console.log('curPage');
                                $scope.noLast = false;    
                                if($scope.curPage*limit >= $scope.fansInfo.total_num) {
                                    console.log('no next');
                                    $scope.noNext = true;    
                                }
                                else {
                                    $scope.noNext = false;    
                                }
                            }
                            for (var i=0,len=$scope.fansInfo.fans.length; i<len; i++) {
                                $scope.fansInfo.fans[i].last_visit_time = $scope.fansInfo.fans[i].last_visit_time.split(' ')[0];  //截取日期  
                            }
                    }).error(function(data) {
                        console.log('data,' + data);
                    });       
            };
            $scope.lastPage = function() {
                if(!hascookie.check('mt')) {
                    return;
                }
                if($scope.noLast) {
                    return;   
                }
                var pageNum = $scope.curPage - 1;
                getFansInfo($scope.goodsInfo.goods_id,pageNum,9);

            };
            $scope.nextPage = function() {
                if(!hascookie.check('mt')) {
                    return;
                }
                if($scope.noNext) {
                    return;    
                }
                var pageNum = $scope.curPage + 1;
                getFansInfo($scope.goodsInfo.goods_id,pageNum,9);
            };
            //老接口
            var getFansData = function(index) {
                var url = host + '/customer/' + $scope.fansInfo.fans[index] + '/shop/' + shop_id + '/info';
                $http.get(url)
                .success(function(data) {
                    $scope.fansData = data;
                    $scope.fansData.last_visit_time = $scope.fansData.last_visit_time.split(' ')[0];
                    console.log($scope.fansData.last_visit_time);
                })
                .error(function(data) {
                    
                });
            };
            var getFansid = function(goods_id) {
                var url = host + '/goods/' + goods_id + '/fans?details=0';
                $http.get(url).success(function(data) {
                    $scope.fansIds = data.fans;
                    if (data.total_num == 0) {
                        $scope.emptyFans = true; 
                    }
                    else {
                        $scope.emptyFans = false;    
                    }
                });
            };
            
            $scope.sendMsg = {};
            var getSendCnt = function() {
                var cntUrl = host + '/merchant/' + shop_id + '/msgconfig';
                $.ajax({
                    url:cntUrl,
                    type:'GET'
                }).success(function(resData) {
                    $scope.totalCnt = resData.current_mass_count;
                    $scope.remainCnt = resData.mass_remain_count;
                    $scope.sentCnt = $scope.totalCnt - $scope.remainCnt;
                    $scope.sendMsg.remind = '本月粉丝群发消息已发送' + $scope.sentCnt + '条,还可以发送' + $scope.remainCnt + '条';
                
                }).error(function () {
                    
                });
                /*
                $http.get(cntUrl).success(function(resData) {
                    $scope.totalCnt = resData.current_mass_count;
                    $scope.remainCnt = resData.mass_remain_count;
                    $scope.sentCnt = $scope.totalCnt - $scope.remainCnt;
                    $scope.sendMsg.letter = '本月粉丝群发消息已发送' + $scope.sentCnt + '条,还可以发送' + $scope.remainCnt + '条';
                    //console.log('letter,' + $scope.sendMsg.letter);
                    console.log('sentCnt,' + $scope.sentCnt);
                    if($scope.remainCnt == 0) {
                        $scope.emptySend = true;
                    }
                    else {
                        $scope.emptySend = false;    
                    }
                }).error();*/
            };

            document.domain = hostname;
            $scope.editorOptions = {
                filebrowserImageUploadUrl:chatHost + '/ck/file/uploader',    //图片上传url
                filebrowserUploadUrl:'',          //文件上传url
                filebrowserBrowseUrl:''           //浏览服务器文件url
            };

            $scope.descRemain = function() {
                if(!hascookie.check('mt')) {
                    return;
                }
                var url = host + '/merchant/' + shop_id + '/msgconfig';
                var data = {type:'desc_remain',cate:'mass'};

                $http({
                        url:url,
                        method:'PUT',
                        data:data
                    }).success(function(resData) {
                        console.log('msgconfig,' + resData);
                    });
            };
            var popDialog2 = function(msg) {
                var modalInstance = $modal.open({
                    animation:true,
                    templateUrl:'views/merchant/account/goods/tpl/alert.html',
                    controller:['$scope','$modalInstance','msg', function($scope,$modalInstance,msg) {
                        $scope.msg = msg;
                        $scope.ok = function() {
                            $modalInstance.close();        
                        };
                    }],
                    resolve:{
                        'msg':function() {
                            return msg;    
                        }    
                    },
                    size:'sm',
                    windowClass:'modal-window'
                });
                /*
                modalInstance.result.then(function() {
                    getSendCnt();        
                });*/
            };
            $scope.sendNotice = function() {
                if(!hascookie.check('mt')) {
                    return;
                }
                var sendUrl =  chatHost + '/chat/' + shop_id + '/fans/message?';
                var msgUrl = host + '/shop/' + shop_id + '/fansmessage';
                var fans = $scope.fansIds;
                var msg = '';
                sendUrl += 'uid=' + fans[0];
                for (var i=1,len=fans.length; i < len; i++) {
                    sendUrl = sendUrl + '&uid=' + fans[i];
                }
                //$scope.descRemain();
                $http({
                    url:sendUrl,
                    method:'POST',
                    data:$scope.sendMsg.letter
                }).success(function(resData) {
                    if (!resData.error) {
                        $http({
                            url:msgUrl,
                            method:'POST',
                            data:{'userids':fans.toString(),'message':$scope.sendMsg.letter,'sendall':true}
                        }).success(function(data) {
                            if(data.is_success) {
                                getSendCnt();
                                $scope.sendMsg.letter = '';
                                console.log('post msgUrl success');
                            }
                        });
                        msg = '消息发送成功!';
                        popDialog2(msg);    
                    }
                    else {
                        msg = '消息发送失败!';
                        popDialog2(msg);
                    }
                });
                
            };
            
            $scope.showBasic = function(goods_id) {
                if(!hascookie.check('mt')) {
                    return;
                }
                $scope.curDetail = 'basic';
                getBasic(goods_id);
                $scope.detailTpl = 'views/merchant/account/goods/detail/basicInfo.html';
            };
            $scope.showImg = function(goods_id) {
                if(!hascookie.check('mt')) {
                    return;
                }
                $scope.curDetail = 'image';
                getImage(goods_id);
                $scope.detailTpl = 'views/merchant/account/goods/detail/image.html';
            };
            $scope.showAttention = function(goods_id) {
                if(!hascookie.check('mt')) {
                    return;
                }
                getAttention(goods_id);    //获取粉丝信息
                $scope.curDetail = 'attention';
                $scope.detailTpl = 'views/merchant/account/goods/detail/attention.html';
            };
            $scope.showMessage = function(goods_id) {
                if(!hascookie.check('mt')) {
                    return;
                }
                getSendCnt();       //获取商家剩余发送数
                getFansid(goods_id);        
                $scope.curDetail = 'message'; 
                $scope.detailTpl = 'views/merchant/account/goods/detail/message.html';
            }
            //表格中查看商品详情
            $scope.showDetail = false;//上架商品部分
            $scope._showDetail = false;//下架商品部分
            $scope.getDetail = function(goods,statusNum) {
                if(!hascookie.check('mt')) {
                    return;
                }
                $scope.showBasic(goods.goods_id); //默认显示基本信息
                if(statusNum == 1) { 
                    $scope.showDetail = true;
                }
                else {
                    $scope._showDetail = true;    
                }
                $scope.goodsInfo = goods;
            };
            $scope.backList = function(statusNum) {
                if(!hascookie.check('mt')) {
                    return;
                }
                if(statusNum == 1) {
                    $scope.showDetail = false;
                }
                else {
                    $scope._showDetail = false;    
                }
            };
    }]);



        app.controller('goodsPublish',['$scope','$rootScope','$http','$location','$timeout','$modal','FileUploader','hascookie',
            function($scope,$rootScope,$http,$location,$timeout,$modal,FileUploader,hascookie) {
                var goods = $scope.goods = {};
                var hostname = $rootScope.hostname;
                var host = $rootScope.proxyUrl;
                var chatHost = $rootScope.chatProxyUrl;
                var shop_id = $rootScope.globals.shop_id;
//                goods.categoryInfo = {};
//                $scope._categoryInfo = {};
                (function() {
                    console.log('get fansnum');
                    $http({
                        url:host + '/shop/' + shop_id + '/fans?offset=0&limit=1',
                        method:'GET'
                    }).success(function(data) {
                        $scope.fansNum = data.total_num;
                        console.log('fansNum,' + $scope.fansNum);
                    });
                })();
                $scope.getCategories = function() {
                if(!hascookie.check('mt')) {
                    return;
                }
                    var categoryUrl = host + '/basic/goodscategories?type=all_tree';
                    $http.get(categoryUrl)
                    .success(function(categoryData) {
                        if(categoryData.goodscategories) {
                            goods._categoryInfo = categoryData.goodscategories;
                            goods.initData();
                        }
                    })
                    .error(function() {
                        
                    });
                };
                $scope.getCategories(); 
                goods.initData = function() {
                    var cateId = 0;
                    var idx = 0;
                    $http({
                        url:host + '/shop/' + shop_id,
                        method:'GET'
                    })
                    .success(function(data) {
                        cateId = data.category_list[0];
                        loop1:
                        for(var i=0,len=goods._categoryInfo.length; i<len; i++) {
                            loop2:
                            for(var j=0,_len=goods._categoryInfo[i].son.length; j<_len; j++) {
                                console.log('id,' + goods._categoryInfo[i].son[j].id);
                                if(cateId == goods._categoryInfo[i].son[j].id) {
                                    console.log('get category,' + j);
                                    idx = j;
                                    goods.category = goods._categoryInfo[i];
                                    goods.subcategory = goods.category.son[j];
                                    break loop1;
                                }
                            }
                        }
                        $scope.$watch('goods.category',function(category) {
                            goods.subcategory = goods.category.son[idx];
                        });
                    });
                    /*
                    goods.category = goods._categoryInfo[0]; //初始化父类
                    goods.subcategory = goods.category.son[0]; //初始化子类
                    */
                    goods.templateUrl = 'views/merchant/account/goods/categories/goods_info.html';
//                    goods.remarkName = '备注';
                };
                goods.categoryChange = function() {
//                    goods.clearData();    
                };
                //商品参数信息
                goods.params = [];


                //商品上传信息
                goods.info = {
                    shop_id : "",
                    category_id : "",
                    description : "",
                    detail : "",
                    bar_code : "",
                    brand_name : "",
                    price : "",
                    promotion_price : "",
                    pic_url_list: "",
                    remark: "",
                    basic_info : goods.params   
                };
                goods.basicInfo = {};  //绑定发布商品的基本信息
                goods.basicInfo.imgList = []; //上传的商品图片列表
                var uploader = $scope.uploader = new FileUploader({     //初始化图片上传配置
                    url: chatHost + '/file/uploader',
                    autoUpload: true                  
               });
                //图片过滤
                uploader.filters.push({
                    name: 'imageFilter',
                    fn: function(item,options) {
                       var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                       return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                    }
                });
                uploader._onSuccessItem = function(fileItem,resData,status,headers) {
                    uploader.queue.splice(0,1);
                    if(resData.url) {
                        console.log('upload image success');
                        goods.basicInfo.imgList.push(resData.url);
                    }    
                }
                goods.delImg = function(index) {
                    if(!hascookie.check('mt')) {
                        return;
                    }
                    goods.basicInfo.imgList.splice(index,1);
                }


                var popDialog = function() {
                    $scope.shop_id = shop_id;
                    var modalInstance = $modal.open({
                        animation:true,
                        templateUrl:'views/merchant/account/goods/tpl/pubDialog.html',
                        controller:['$scope','$modalInstance','$http','shop_id','fansNum', function($scope,$modalInstance,$http,shop_id,fansNum) {
                            $scope.notice = true;
                            $scope.rest = true;
                            $scope.cb = true; //checkbox 可用
                            $scope.shop_id = shop_id;
                            $scope.fansNum = fansNum;
                            var url = host + '/merchant/' + $scope.shop_id + '/msgconfig';
                            $http.get(url)
                            .success(function(data) {
                                $scope.restNum = data.mass_remain_count;
                                if($scope.restNum <= 0 || $scope.fansNum == 0) {
                                    console.log('notice false');
                                    $scope.cb = false;
                                    $scope.rest = false;
                                    $scope.notice = false;
                                }
                                $scope.postedNum = data.current_mass_count - data.mass_remain_count;
                            })
                            .error(function(data) {
                                
                            });
                            $scope._confirm = function() {
                                $modalInstance.close($scope.notice);
                            };
                            $scope._cancel = function() {
                                $modalInstance.dismiss('cancel');    
                            };
                            }],
                        resolve:{
                            shop_id:function() {
                                return  $scope.shop_id;     
                            },
                            fansNum:function() {
                                return $scope.fansNum;        
                            }
                        },
                        size:'sm',
                        windowClass:'modal-window',
                        backdropClass:'modal-backdrop'
                    });    
                    modalInstance.result.then(function(notice) {
                        $scope.notice = notice;
                        console.log('notice',$scope.notice);
                        postData();
                    });
                };
                //发布
                goods.postComm = function () {
                    if(!hascookie.check('mt')) {
                        return;
                    }
                    popDialog();
                };
                goods.legalPrice = true;
                goods.priceRight = true;
                goods.legalProPrice = true;
                goods.proPriceRight = true;
                //检查售价
                goods.checkPrice = function () {
                    console.log(goods.basicInfo.price);
                    console.log('price blur');
                    if(goods.basicInfo.price) {
                        console.log('has price');
                        if(!goods.basicInfo.proPrice) {
                            console.log('no pro');
                            goods.priceRight = true;
                            if(angular.isNumber(goods.basicInfo.price) && goods.basicInfo.price > 0) {
                                console.log('legalPrice');
                                goods.legalPrice = true;
                            }
                            else {
                                console.log('ilegalprice');
                                goods.legalPrice = false;
                            }
                        }
                        else {
                            if(goods.legalProPrice) {
                                if(goods.basicInfo.price < goods.basicInfo.proPrice) {
                                    console.log('price err');
                                    goods.priceRight = false;
                                }
                                else {
                                    console.log('price right');
                                    goods.priceRight = true;
                                    goods.proPriceRight = true;
                                }
                            }
                        }
                    }
                };
                //检查促销价
                goods.checkProPrice = function () {
                    console.log('proprice blur,' + goods.basicInfo.proPrice);
                    if(goods.basicInfo.proPrice) {
                        if(!goods.basicInfo.price) {
                            goods.proPriceRight = true;
                            if(angular.isNumber(goods.basicInfo.proPrice) && goods.basicInfo.proPrice > 0) {
                                goods.legalProPrice = true;
                            }
                            else {
                                goods.legalProPrice = false;
                            }
                        }
                        else {
                            if(goods.legalPrice) {
                                if(goods.basicInfo.price < goods.basicInfo.proPrice) {
                                    goods.proPriceRight = false;
                                }
                                else {
                                    goods.proPriceRight = true;
                                    goods.priceRight = true;
                                }
                            }
                        }
                    } 
                };
                //检查类似备注一类的basic_info
                goods.checkData = function(k,v) {
                    if(v) {
                        var data = {paramsName:k,paramsValue:v};
                        goods.params.push(data);
                    }       
                };
                //组织发布数据
                goods.fillData = function() {
                    goods.info = {
                        shop_id:shop_id,
                        category_id:goods.subcategory.id,
                        description:goods.basicInfo.name,
                        detail:goods.basicInfo.detail,
                        bar_code:goods.basicInfo.barcode,
                        brand_name:goods.basicInfo.brandName,
                        price:goods.basicInfo.price,
                        promotion_price:goods.basicInfo.proPrice,
                        pic_url_list:goods.basicInfo.imgList.toString(),
                        remark:goods.basicInfo.remark,
                        basic_info:angular.toJson(goods.params),
                        is_sendall:$scope.notice
                    };        
                };
                //清空数据
                goods.clearData = function() {
                    goods.basicInfo = {};
                    goods.basicInfo.imgList = [];
                };
                var postData = function() {
                    if(!hascookie.check("mt")) {
                        return;
                    }
                    var postUrl = host + '/goods';
                    goods.checkData(goods.remarkName,goods.remark);
                    goods.fillData();
                    $http({
                        method: 'POST',
                        url: postUrl,
                        data: goods.info
                    }).success(function(resData) {  
                        if (resData.is_success) {
                            console.log('goods_id,' + resData.goods_id);
                            emit();
                        }
                        goods.clearData();
                    }).error(function(data) {
                       goods.clearData(); 
                    });

                };
                //取消发布
                goods.cancelPublish = function() {
                    emit();
                    goods.clearData();
                        
                };
                //
                var emit = function() {
                    var model = 'change';
                    $scope.$emit('modelChange',model);
                };

                //界面富文本编辑器配置
                document.domain = hostname;
                $scope.editorOptions = {
                        filebrowserImageUploadUrl:chatHost + '/ck/file/uploader',    //图片上传url
                    filebrowserUploadUrl:'',          //文件上传url
                    filebrowserBrowseUrl:'',           //浏览服务器文件url
                    extraPlugins: 'placeholder'
                };

/*
               //格式输出函数 
                var kvFormat = function(k,val) {
                    return {
                            paramsName : k,
                            paramsValue : val
                            
                        };
                };

                
                //各商品参数选择情况 
                goods.selection = {
                    design : [],
                    styles : [],
                    texture : [],
                    efficacy : [],
                    service : [],
                    perfume : [],
                    skin : []
                };
        
                //商品参数选择与否 函数
                goods.toggleSelection = function(evt,val,key) {
                    var arrName = evt.target.attributes.name.value;        
                    var idx = goods.selection[arrName].indexOf(val);
                    var arrLen;
                    if(idx > -1) {
                        goods.selection[arrName].splice(idx,1);
                        arrLen = goods.selection[arrName].length;
                        if(arrLen == 0) {
                            for(var i=0,len=goods.commParams.length; i<len; i++) {
                                if(goods.commParams[i].paramsName == key) {
                                    goods.commParams.splice(i,1);
                                    return;
                                }    
                            }
                        }
                        else {
                            for(var i=0,len=goods.commParams.length; i<len; i++) {
                                if(goods.commParams[i].paramsName == key) {
                                    goods.commParams[i].paramsValue = goods.selection[arrName].toString();
                                }
                            }        
                        }
                    }
                    else {
                        goods.selection[arrName].push(val);
                        if(goods.commParams.length == 0) {
                            goods.commParams.push(kvFormat(key,goods.selection[arrName].toString()));           
                        }
                        else {
                            for(var i=0,len=goods.commParams.length; i<len; i++) {
                                if(goods.commParams[i].paramsName == key) {
                                    goods.commParams[i].paramsValue = goods.selection[arrName].toString();
                                    return;
                                }
                            }
                            goods.commParams.push(kvFormat(key,goods.selection[arrName].toString()));
                        }
                    }  
                };*/    
            }]);

});
