'use strict';
Array.prototype.remove = function(val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
	
define(['angular','app','md5','directives/remoteValidation','directives/checkcaptcha'], function(angular,app) {
	app.controller('mtregisterCtrl',['$scope','$rootScope','$http','$filter', '$interval',function($scope,$rootScope,$http,$filter,$interval) {
	document.title='商家入驻 -喵喵熊';
	
	var host = $rootScope.proxyUrl;
	$scope.regaccount=true;
	$scope.completeinfo=false;
	$scope.waitcheck=false;
	var user = $scope.user = {};
	$scope.reggg=function(){
		$scope.regaccount=true;
		$scope.completeinfo=false;
		$scope.waitcheck=false;
	};
	$scope.reg=function(){
		$scope.regaccount=false;
		$scope.completeinfo=true;
		$scope.waitcheck=false;

		//console.log($scope.maparea)
	};

	//发送手机验证码
		$scope.getcap=false;
		var res=$scope.res={};
		res.sCount=60;
		$scope.resend = '重新发送' + '('+res.sCount + ')';
		$scope.Getcaptcha=function(){
			$scope.getcap=true;
			$interval(function(){
				if(res.sCount>1){
					res.sCount=res.sCount-1;
				}else{
					$scope.getcap=false;
					res.sCount=60;
				}
			},1000,60);

			$http.get(host+'/basic/phonevalidate/'+$scope.telephone_no).success(function(){});
		};
		
		$scope.$watch('res.sCount',function(newVal){
				$scope.resend = '重新发送' + '(' + res.sCount + ')';
			});
		
		
		
	//行业类别弹出框
	$http.get(host+'/basic/goodscategories?type=all_tree').success(function(catelist){
			$scope.cate=catelist.goodscategories;
	
		$scope.choseccates = function(ccate){
			$scope.category_list=ccate.name;
			$scope.cateid=ccate.id;
			};
	});
	$http.get(host+'/basic/cities').success(function(responsecity){
		$scope.citylist=responsecity.cities;	//获取城市列表
		$scope.city_id=$scope.citylist[0].city_id;

			
		$http.get(host+'/basic/districts?city_id='+$scope.city_id).
			success(function(respondistrict){
				$scope.districtlist=respondistrict.districts;//获取城区列表
			});		
	});

	//地图插件
		$scope.myMarkers = [];
    	var preMarker = null;
        $scope.mapOptions = {
            ngCenter: {
				lat: 31.879624,
                lng: 117.119888				
   		        },
			//city:'合肥',	//添加了城市名为地图中心的方法
            ngZoom:13 ,
            toolbar: true,	
            scrollzoom: true,
            maptype: true,
            overview: true,
            locatecity: false,
            resizeEnable: false,
        };
		
		$scope.changemapcenter=function(){
			$http.get(host+'/basic/districts?city_id='+$scope.city_id).success(function(respondistrict){
		$scope.districtlist=respondistrict.districts;//获取城区列表
			});
        $scope.$watch('maparea', function(map) {
			 		//根据城市ID查询城市信息city_name
            $http.get(host+'/basic/city/' + $scope.city_id).success(function (rescity) {
                $scope.cityname = rescity.city_name;
				map.centerAndZoom($scope.cityname, 13);  // 初始化地图,设置中心点坐标和地图级别
                map.enableDragging();
				map.checkResize();
				map.addControl(new BMap.NavigationControl());    
				map.addControl(new BMap.ScaleControl());     
				map.setDefaultCursor('crosshair');
				map.enableContinuousZoom(); 
				map.enableScrollWheelZoom();
				map.highResolutionEnabled();
            });	
        });		
		};
		//搜索功能回车键
		$scope.enter=function(ev){
			$scope.$watch('maparea', function(map) {
					if (ev.keyCode === 13) {
						var position=new BMap.LocalSearch(map,{renderOptions:{map:map,autoViewport:true}});
						map.clearOverlays();//清空所有地图标记
						position.search($scope.position);	
					}
			});
		};
			//搜索--start
		$scope.$watch('maparea', function(map) {
				$scope.mapsearch=function(){
					var position=new BMap.LocalSearch(map,{renderOptions:{map:map,autoViewport:true}});
					map.clearOverlays();//清空所有地图标记
					position.search($scope.position);	
				}; 
		});
		
		//搜索--end
        $scope.addMarker = function ($event, $params) {
            if(preMarker){
                $scope.maparea.removeOverlay(preMarker);
            }
            var marker = new BMap.Marker(
                $params[0].point
            );
      	    $scope.myMarkers.push(marker);
            $scope.maparea.addOverlay(marker);
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
	

	//提交表单
	$scope.regshop = function(){
		var formdata={
			'account':user.account,
			'password':hex_md5(user.password),
			'contact_name':$scope.contact_name,
			'contact_phone_no':$scope.contact_phone_no,
			'brand_name':$scope.brand_name,
			'shop_name':$scope.shop_name,
			'business_hours':$scope.business_hours,
			'telephone_no':$scope.telephone_no,
			'city_id':$scope.city_id,
			'district_id':$scope.district_id,
			'business_area':$scope.business_area,
			'address':$scope.address,
			'longitude':$scope.longitude,
			'latitude':$scope.latitude,
			'category_list':$scope.cateid,
		};

		$http.post(host+'/merchant',formdata).success(function(res){
			if(res.is_success===false){		
				user.feedres = true;
			}else{
			$scope.completeinfo=false;
			$scope.waitcheck=true;	
			}
		});
		};
	user.tologin = function(){
		window.location.href='#/merchant/login';
	};	
		}]);	
   
	

app.controller('PartnerCtrl',['$scope','$rootScope','$http', function($scope,$rootScope,$http) {
	//首页，合作商家展示
	document.title = '入驻商家 -喵喵熊';
	var host = $rootScope.proxyUrl;
	
	$http.get( host+'/basic/joinshops?offset=0&limit=16').
	success(function(data) {
                           $scope.shopinfo = data.shops;					
						}
			);
		        }]);
					  
				 

app.controller('aboutCtrl',[ function() {
	document.title = '关于我们 -喵喵熊';	
		       	  }]);	

app.controller('mainCtrl',[ function() {
	document.title = '喵喵熊 妙生活';	
		       	  }]);					  
				  
 });