'use strict';
function in_array(arr, value) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === value) {
            return true;
        }
    }
    return false;
}

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
//取两个数组的交集 取两个数组相同的元素
function arrayIntersection ( a, b )
{
    var ai=0, bi=0;
    var result = new Array();
    while ( ai < a.length && bi < b.length )
    {
        if      ( a[ai] < b[bi] ) { ai++; }
        else if ( a[ai] > b[bi] ) { bi++; }
        else /* they're equal */
        {
            result.push ( a[ai] );
            ai++;
            bi++;
        }
    }
    return result;
};
function JSONLength(obj) {
	var size = 0, key;
	for (key in obj) {
	if (obj.hasOwnProperty(key)) size++;
	}
	return size;
	};
define(['angular', 'app', 'qrcode', 'qrcodeUTF8', 'directives/ngthumb','services/checkcookie'], function (angular, app) {
    app.controller('shopCtrl', ['$scope', '$rootScope', '$http',function ($scope, $rootScope, $http) {
		
		var host = $rootScope.proxyUrl;
        $scope.curSubnav = 'info';
        $scope.modSubnav = function (obj) {
            $scope.curSubnav = obj.target.attributes.data.value;
        };
        $scope.shopInfo = true;
        $scope.shopPic = false;
        $scope.shopIntro = false;
        $scope.info = function () {
            $scope.shopInfo = true;
            $scope.shopPic = false;
            $scope.shopIntro = false;
        };
        $scope.pic = function () {
            $scope.shopInfo = false;
            $scope.shopPic = true;
            $scope.shopIntro = false;
        };
        $scope.intro = function () {
            $scope.shopInfo = false;
            $scope.shopPic = false;
            $scope.shopIntro = true;
        };

    }]);
    app.controller('shopInfoCtrl', ['$scope', '$rootScope', '$http','$timeout','hascookie',function ($scope, $rootScope, $http,$timeout,hascookie) {
		document.title = '店铺 -喵喵熊';
		var host = $rootScope.proxyUrl;
        var shop_id = $rootScope.globals.shop_id;
        $http.get(host+'/shop/' + shop_id).success(function (shopinfo) {//获取商店基本信息
            $scope.brand_name = shopinfo.brand_name;
            $scope.shop_name = shopinfo.shop_name;
            $scope.business_hours = shopinfo.business_hours;
            $scope.telephone_no = shopinfo.telephone_no;
            $scope.city_id = shopinfo.city_id;
            $scope.district_id = shopinfo.district_id;
            $scope.business_area = shopinfo.business_area;
            $scope.address = shopinfo.address;
            $scope.mapmark = '经度 ' + shopinfo.longitude + '  纬度 ' + shopinfo.latitude;
            $scope.shopqrcode = shopinfo.qrcode;
			$scope.category_list = shopinfo.category_name_list[0];
			var maplong=$scope.longitude=shopinfo.longitude;
			var maplat=$scope.latitude=shopinfo.latitude;
     
            
			
			 //行业类别弹出框
			 
        $http.get(host+'/basic/goodscategories?type=all_tree').success(function (catelist) {
            $scope.cate = catelist.goodscategories;
				$scope.ccateChange=function(ccate){
					$scope.category_list=ccate.name;
					$scope.cateid=ccate.id;
					//console.log('cateid is '+ccate.id);
				};
			});
			
            var shopinfocityid = shopinfo.city_id;
            var shopinfodistrictid = shopinfo.district_id;

    
            //根据城市ID查询城市信息city_name
            $http.get(host+'/basic/city/' + shopinfo.city_id).success(function (rescity) {

                $scope.city = rescity;
                $scope.curcity_id = $scope.city.city_id;
				
				 $http.get(host+'/basic/cities').success(function (responsecity) {
                $scope.citylist = responsecity.cities;	//获取城市列表
				$http.get(host+'/basic/districts?city_id='+ $scope.curcity_id).success(function (respondistrict) {
					$scope.districtlist = respondistrict.districts;//获取城区列表
				});
			});
        
            });

            $http.get(host+'/basic/district/' + shopinfo.district_id).success(function (resdistrict) {//根据城区ID查询城区信息disctrict_name
                $scope.district = resdistrict;
                $scope.curdistrict_id = $scope.district.district_id;
            });


           
        //百度地图
		$scope.myMarkers = [];
    	var preMarker = null;
        $scope.mapOptions = {
            ngCenter: {
                lat: 31.871456,
                lng: 117.2935
   		        },
            ngZoom:13 ,
            toolbar: true,
            scrollzoom: true,
            maptype: true,
            overview: true,
            locatecity: false,
            resizeEnable: true,
        };

        $scope.$watch('maparea', function(map) {
             if (map) {
				var point =new BMap.Point($scope.longitude, $scope.latitude);
				map.centerAndZoom(point,18);		
                map.enableDragging();
				map.addControl(new BMap.NavigationControl());    
				map.addControl(new BMap.ScaleControl());
				map.addControl(new BMap.MapTypeControl());
				map.setDefaultCursor('crosshair');
				map.enableContinuousZoom(); 
				map.enableScrollWheelZoom();
				var marker=$scope.premarker=new BMap.Marker(point);
				map.addOverlay(marker);
            }				
            }
        );		
		$scope.changemapcenter=function(){
			$http.get(host+'/basic/districts?city_id='+ $scope.curcity_id).success(function (respondistrict) {
					$scope.districtlist = respondistrict.districts;//获取城区列表
				});
			$scope.$watch('maparea', function(map) {
             if (map) {
			 		//根据城市ID查询城市信息city_name
            $http.get(host+'/basic/city/' + $scope.curcity_id).success(function (rescity) {
                $scope.cityname = rescity.city_name;
				map.centerAndZoom($scope.cityname, 13);  // 初始化地图,设置中心点坐标和地图级别
                map.enableDragging();
				map.addControl(new BMap.NavigationControl());    
				map.addControl(new BMap.ScaleControl());     
				map.setDefaultCursor('crosshair');
				map.enableContinuousZoom(); 
				map.enableScrollWheelZoom();
            });	
				
            }
			});	
		};
		
		//搜索功能回车键
		$scope.enter=function(ev){
			$scope.$watch('maparea', function(map) {
				if(map){
					if (ev.keyCode === 13) {
						var position=new BMap.LocalSearch(map,{renderOptions:{map:map,autoViewport:true}});
						map.clearOverlays();//清空所有地图标记
						position.search($scope.position);
						var i=1;
						position.setSearchCompleteCallback(
							function(rs){
								if(position.getStatus()===BMAP_STATUS_SUCCESS){
									for(var j=0;j<rs.getCurrentNumPois();j++){
										var poi=rs.getPoi(j);
										//map.addOverlay(new Bmap.Marker(poi.point));//如果查询到，添加红色标记
									}
									//if(rs.getPageIndex!=rs.getNumPages()){position.gotoPage(i);i=i+1;}
								}
							}
						);
					}
				}
			});
		};
			//搜索--start
		$scope.$watch('maparea', function(map) {
			if(map){
				$scope.mapsearch=function(){
					var position=new BMap.LocalSearch(map,{renderOptions:{map:map,autoViewport:true}});
					map.clearOverlays();//清空所有地图标记
					position.search($scope.position);
					var i=1;
					position.setSearchCompleteCallback(
						function(rs){
							if(position.getStatus()===BMAP_STATUS_SUCCESS){
								for(var j=0;j<rs.getCurrentNumPois();j++){
									var poi=rs.getPoi(j);
									//map.addOverlay(new Bmap.Marker(poi.point));//如果查询到，添加红色标记
								}
								//if(rs.getPageIndex!=rs.getNumPages()){position.gotoPage(i);i=i+1;}
							}
						}
					);
				} ;
			}
		});//搜索--end	

        $scope.addMarker = function ($event, $params) {
			$scope.maparea.removeOverlay($scope.premarker);
            if(preMarker){
                $scope.maparea.removeOverlay(preMarker);
            }
            var marker = new BMap.Marker(
                $params[0].point
            );
      	    $scope.myMarkers.push(marker);
            $scope.maparea.addOverlay(marker);
            //$scope.currentMarkerLat = marker.getPosition().lat;
            $scope.latitude= $scope.currentMarkerLat = marker.getPosition().lat;
			$scope.longitude= $scope.currentMarkerLng = marker.getPosition().lng;
            preMarker = marker;
			$scope.mapmark='经度'+$scope.longitude+'   '+'纬度'+$scope.latitude; 
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
            $scope.maparea.addOverlay($scope.myInfoWindow);
            $scope.maparea.openInfoWindow($scope.myInfoWindow, marker.getPosition());		
        };

        $scope.setMarkerPosition = function (marker, lat, lng) {
            marker.setPosition(new BMap.Point(lng, lat));		
        };

});
//保存修改

        $scope.savechange = function (index) {
			if(hascookie.check('mt')) {
				var formdata = {
					'brand_name': $scope.brand_name,
					'category_list':$scope.cateid,
					'shop_name': $scope.shop_name,
					'business_hours': $scope.business_hours,
					'telephone_no': $scope.telephone_no,
					'city_id': $scope.curcity_id,
					'district_id': $scope.curdistrict_id,
					'business_area': $scope.business_area,
					'address': $scope.address,
					'longitude': $scope.longitude,
					'latitude': $scope.latitude,
				};
				$http.put(host+'/shop/' + shop_id, formdata).success(
					function (data) {
					$scope.resultinfoyes=index;
						if(data.is_success){
							$scope.resultinfo='成功';
						}else{
							$scope.resultinfo='失败，未知错误';
						}
						$timeout(function(){
							$scope.resultinfoyes=0;
							},3000);
					}
				);
			}
        };

	
    }]);

//图文介绍页面		 
    app.controller('shopIntroCtrl', ['$scope', '$rootScope', '$http', '$sce','hascookie',
        function ($scope, $rootScope, $http, $sce,hascookie) {
            var shop_id = $rootScope.globals.shop_id;
            var host = $rootScope.proxyUrl;
			var hostname = $rootScope.hostname;
			var imghost = $rootScope._chatProxyUrl;
            $scope.editor = false;
            //界面富文本编辑器配置
            $scope.introduction = null;
            document.domain = hostname;
            $scope.editorOptions = {
				height:"470px",
				toolbarCanCollapse:'true',
				
                filebrowserImageUploadUrl:'http://'+ imghost+'/ck/file/uploader',    //图片上传url
                filebrowserUploadUrl: '',          //文件上传url
                filebrowserBrowseUrl: ''           //浏览服务器文件url
            };
            //获取商家图文介绍信息
            $scope.getIntro = function () {
                var getUrl = host + '/shop/' + shop_id + '/introduction';
                $http.get(getUrl).success(function (resData) {
                    if (resData) {
							//html宽度控制开始
							//m_info_width = $(".m_table").width() - 42;
							var m_info_width=720;
							var html = resData.introduction;
							var re = new RegExp("height:(.*?)px; width:(.*?)px", ["g"]);
							var res;
							while (res = re.exec(html)) {
								if (res[2] > m_info_width) {
									var nw = m_info_width;
									var nh = res[1] * m_info_width / res[2];
									html = html.replace(res[0], "height:" + String(nh) + "px; width:" + String(nw) + "px")
								}
							}
							$scope.intro = $sce.trustAsHtml(html);
							//html宽度控制结束
                       // $scope.intro = $sce.trustAsHtml(resData.introduction);
                    }
                })
                    .error(function () {

                    });

            };
            $scope.getIntro();
            $scope.editIntro = function () {
				if(hascookie.check('mt')){	
					$scope.editor = true;
					$scope.introduction = $scope.intro;
				}
            };
            $scope.caceledit = function () {
                $scope.editor = false;
            };
            $scope.saveIntro = function () {
				if(hascookie.check('mt')){
					var postUrl = host + '/shop/' + shop_id + '/introduction';
					var introduction = $scope.introduction;
					var postData = {introduction: introduction};
					// console.log('introoooooo,' + postData.introduction);
					$http({
						url: postUrl,
						method: 'POST',
						data: {introduction: introduction}
					}).success(function (resData) {
						// console.log('post success');
						$scope.editor = false;
						$scope.getIntro();
					}).error(function () {
						$scope.editor = false;
					});
				}	
            }

        }]);


//	店面图片页面
    app.controller('shopPicCtrl', ['$scope', '$rootScope', '$http', '$state', '$stateParams', 'FileUploader','hascookie',
        function ($scope, $rootScope, $http, $state, $stateParams, FileUploader,hascookie) {
            var shop_id = $rootScope.globals.shop_id;

            var host = $rootScope.proxyUrl;
			var imghost = $rootScope._chatProxyUrl;
            var imgUrl = host + '/shop/' + shop_id + '/image';
            $http.get(imgUrl)
                .success(function (commDetail) {   //请求后台该商店图片
                    $scope.imgInfo = commDetail;

                }).error(function (data) {
             
                });

 
            var uploader = $scope.uploader = new FileUploader({
                url: 'http://'+imghost+'/file/uploader',
                autoUpload: true
            });
            uploader.filters.push({
                name: 'imageFilter',
                fn: function (item, options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            });
            uploader._onProgressItem = function (item, progress) {
				if(hascookie.check('mt')){
					$scope.inupload = true;
				}
            };
            uploader._onSuccessItem = function (fileItem, resData, status, headers) {
				if(hascookie.check('mt')){
					if (resData.url) {
						uploader.queue.splice(0, 1);
						$scope.imgInfo.shop_img_urls.unshift(resData.url);
						var imgList = $scope.imgInfo.shop_img_urls.toString();
						var putData = {pic_url_list: imgList};
						$http({
							url: imgUrl,
							method: 'PUT',
							data: putData
						}).success(function (resData) {
							if (resData.is_success) {
							   // console.log('upload success');
							}
						}).error(function () {
						});

					}
				}	
            };
			//放大图片
			$scope.zoom=function(imgsrc,index){
				if(hascookie.check('mt')){
					$scope.showimg=true;
					$scope.imagesource=imgsrc + '@752w_752h_0e_1l';
					//获取图片数量

					var indexmax=JSONLength($scope.imgInfo.shop_img_urls);
					//console.log('max is '+indexmax);
					$scope.noLast = false;
					$scope.noNext = false;
					if(index == 0) {
						$scope.noLast = true;
					}
					if(index == indexmax - 1) {
						$scope.noNext = true;
					}
					//前进，后退切换图片
					$scope.backwardPic=function($index){
						var i=--index;
						if(i>=0){
						$scope.imagesource=$scope.imgInfo.shop_img_urls[i]+'@752w_752h_0e_1l';
						}else{
						$scope.imagesource=$scope.imgInfo.shop_img_urls[0]+'@752w_752h_0e_1l';
						index=0;
						}	
						if(index == 0) {
						$scope.noLast = true;
						}
						$scope.noNext = false;	
					};
					$scope.forwardPic=function($index){
						var j=++index;
						if(j<indexmax){
						$scope.imagesource=$scope.imgInfo.shop_img_urls[j]+'@752w_752h_0e_1l';
						}else{
						$scope.imagesource=$scope.imgInfo.shop_img_urls[indexmax-1]+'@752w_752h_0e_1l';
						index=indexmax-1;
						}
						if(index == indexmax - 1) {
						$scope.noNext = true;
						}
						$scope.noLast = false;
					}
				}
			}
            //删除图片
            $scope.delPic = function (imgsrc) {
				if(hascookie.check('mt')){
					$scope.imgInfo.shop_img_urls.remove(imgsrc);
					//console.log($scope.imgInfo.shop_img_urls);
					var imglist = $scope.imgInfo.shop_img_urls.toString();
					var putdata = {pic_url_list: imglist};
				   // console.log('imglist is ' + putdata);
					$http.put(imgUrl, putdata).success(function () {
						//console.log('delete is success')
					})
				}	
            };
			
			
        }]);

});
