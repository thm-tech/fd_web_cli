'use strict';

define(['angular','app'], function(angular,app) {
    app.controller('downloadCtrl',['$scope','$rootScope','$http',
        function($scope,$rootScope,$http,$location) {
        	document.title = 'App下载 -喵喵熊';
            $scope.android = false;
            $scope.iphone = false;
            var sUserAgent = navigator.userAgent.toLowerCase();  
            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";  
            var bIsAndroid = sUserAgent.match(/android/i) == "android"; 
            if(bIsAndroid) {
                $scope.android = true;    
//                window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=cc.fotoplace.app';          
            }
            else if(bIsIphoneOs) {
                $scope.iphone = true;
 //               window.location.href = 'https://itunes.apple.com/cn/app/id877174386?mt=8';
            }
            $scope.downApp = function(phone) {
            		if(phone === 'android') {
            				window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=cc.fotoplace.app'; 
            		}			
            		else if(phone === 'iphone'){
            				window.location.href = 'https://itunes.apple.com/cn/app/id877174386?mt=8';
            		}
            };
    }]);
});
