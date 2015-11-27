'use strict';

define(['angular','app','services/authorization','services/ucmsgdata','directives/scrollonclick','services/rememberMe'], function(angular,app) {
    app.controller('cmaccountCtrl',['$scope','$rootScope','$http','$location','$window','$interval','authorization','ucmsgdata','remember',
        function($scope,$rootScope,$http,$location,$window,$interval,authorization,ucmsgdata,remember) {
            console.log($rootScope.globals);
            var accountInfo = $scope.accountInfo = {};
            var host = $rootScope.proxyUrl;
            accountInfo.accountName = $rootScope.globals.username || '';
            accountInfo.portraitUrl = $rootScope.globals.portrait || '';
            $scope.loadChat = false;
            if($rootScope.globals.username && $rootScope.globals.portrait) {
                $scope.loadChat = true;
                accountInfo.accountName = $rootScope.globals.username;
                accountInfo.portraitUrl = $rootScope.globals.portrait;
            }
            else {
                var getInterval = $interval(function() {
                    console.log('gettttttttttttttt');
                    if($rootScope.globals.username && $rootScope.globals.portrait) {
                        $scope.loadChat = true;
                        $interval.cancel(getInterval);    
                    }
                    accountInfo.accountName = $rootScope.globals.username;
                    accountInfo.portraitUrl = $rootScope.globals.portrait;
                },100,15);
            }
            $scope.needChat = true;
            $scope.curNav = '';
            $scope.curHomeUrl = '#/customer/account/shops';
            accountInfo.newMsg = {read:false};
            var curPath = $location.path().split('/')[3];
            var analysePath = function() { 
                if(curPath == 'settings' || curPath == 'feedback') {
                    $scope.needChat = false;
                    $scope.curNav = '';
                }
                else {
                    $scope.needChat = true;
                    $scope.curNav = curPath;
                }
            };
            $scope.modNav = function(path) {
                if(path == 'settings' || path == 'feedback') {
                    $scope.needChat = false;
                    $scope.curNav = '';
                }
                else {
                    $scope.needChat = true;
                    $scope.curNav = path;
                }
                if(path == 'message') {
                    $scope.$broadcast('reloadMsg');
                    accountInfo.newMsg.read = false;
                }
            };
            $scope.logout = function() {
            		document.title = "喵喵熊 妙生活";
                authorization.clearCredentials();
                $http({
                    url:host + '/user/logout',
                    method:'POST',
                    data:{}
                })
                .success(function(resData) {
        
                })
                .error(function(data) {
                    
                });

                $location.path('/index');
                $scope.$broadcast('logout');
            };
            var broadcast = function(evt,msg) {
                $scope.$broadcast(evt,msg);
            };
            $scope.$on('changeHome',function(evt,msg) {
                console.log('home id ' + msg);
                $scope.curHomeUrl = '#/customer/account/shops?city=' + msg;    
            });
            $scope.$on('changeHead',function(evt,msg) {
                accountInfo.portraitUrl = msg;        
                broadcast('_changeHead',msg);
            });
            $scope.$on('changeName',function(evt,msg){
                accountInfo.accountName = msg;    
                broadcast('_changeName',msg);
            });
            $scope.$on('UcMsgChannel',function(evt,msg) {
                console.log('onnnnnnnnnnnnnn');
                console.log(msg);
                accountInfo.newMsg.read = true;
                $scope.$digest();
//                broadcast('_UcMsgChannel',msg);    
                ucmsgdata.setData(msg);
            });
            $scope.$on('_sendObjChannel',function(evt,msg) {
                console.log('objjjj');
                console.log(msg);
                broadcast('sendObjChannel',msg);               
            });
            $scope.$on('_chatToOwnerChannel',function(evt,msg) {
                console.log('chat to owner');
                console.log(msg);
                broadcast('chatToOwnerChannel',msg);                      
            });
            $scope.$on('_enterShopChannel',function(evt,msg) {
                console.log('enter,' + msg);
                console.log(msg);
                broadcast('enterShopChannel',msg);               
            });
            $scope.$on('recvObjChannel',function(evt,msg) {
                broadcast('_recvObjChannel',msg);               
            });

            $window.onscroll = function() {
                var scrollPos = $(window).scrollTop();
                var docHeight = $(document).height();
                var winHeight = $(window).height();
                var totalHeight = parseInt(winHeight + scrollPos);
                $scope.$apply(function() {
                    $scope.showTop = (scrollPos >= 300) ? true : false;
                });
               // console.log("滚动条到顶部的垂直高度: "+$(document).scrollTop());
//                console.log("滚动条到顶部的距离: "+$(window).scrollTop());
//                console.log("页面的文档高度 ："+$(document).height());  
//                console.log('浏览器的高度：'+$(window).height());  
//                console.log('总高,' + totalHeight);
                var scrollData = {totalHeight:totalHeight,docHeight:docHeight,scrollPos:scrollPos};
                broadcast('scroll',scrollData);
            }
            analysePath();
    }]);
});
