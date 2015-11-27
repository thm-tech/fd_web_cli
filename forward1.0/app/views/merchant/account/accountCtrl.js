'use strict';

define(['angular','app','services/authorization'], function(angular,app) {
    app.controller('mtaccountCtrl',['$scope','$rootScope','$http','$location','authorization',
        function($scope,$rootScope,$http,$location,authorization) {
        		document.title = '聊天室 -喵喵熊';
            var accountInfo = $scope.accountInfo = {};
            var host = $rootScope.proxyUrl;
            var shop_id = $rootScope.globals.shop_id;
            $scope.chatObj = {};
            $scope.chatObj.messageNum = '';
            $scope.overScroll = false;
            accountInfo.accountName = $rootScope.globals.username;
            accountInfo.status = $rootScope.globals.merchant_service_status; 
            accountInfo.pfPhone = $rootScope.serviceTEL;
            var path = $location.path().split('/');
            var analyseStatus = function() {
                if(accountInfo.status == 2) {
                    $scope.service = true;
                    $scope.navList = ['#/merchant/account','#/merchant/account/fans','#/merchant/account/goods','#/merchant/account/activity','#/merchant/account/shop'];
                }
                else {
                    $scope.service = false;
                    $scope.navList = ['#/merchant/account','#/merchant/account','#/merchant/account','#/merchant/account','#/merchant/account'];
                    if(accountInfo.status == 1) {
                        accountInfo.statusStr = "审核中...";
                        accountInfo.remindStr = "如有疑问请致电";
                    }
                    else if (accountInfo.status == 3) {
                        accountInfo.statusStr = "您已欠费,请及时";
                        accountInfo.remindStr = "如有疑问请致电";
                    }
                    else if (accountInfo.status == 4){
                        accountInfo.statusStr = "审核未通过"
                        accountInfo.remindStr = "如有疑问请致电";
                    }
                    else if (accountInfo.status == 5) {
                        accountInfo.statusStr = "服务期满,请";
                        accountInfo.remindStr = "如有疑问请致电";
                    }
                }
            };
            var analysePath = function() {
                if(path[3]) {
                    $scope.curNav = path[3];
                    $scope.chat = false;
                    $scope.noservice = false;
                }
                else {
                    $scope.curNav = 'chatroom';
                    $scope.chat = true;
                    $scope.noservice = true;
                }
            };
            window.onscroll = function() {
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                if(scrollTop >90 ) {
                    $scope.$apply(function() {
                        $scope.overScroll = true;
                    });
                }
                else {
                    $scope.$apply(function() {
                        $scope.overScroll = false;    
                    });
                }
            };
            var getHimage = function() {
                var url = host + '/merchant/' + shop_id + '/info';
                $http.get(url)
                .success(function(data) {
                    accountInfo.portraitUrl = data.portrait_url;    
                });
            };
            //头像修改事件
            $scope.$on('changeHead',function(evt,msg) {
                accountInfo.portraitUrl = msg;
                broadcast('_changeHead',msg);
            });
            $scope.$on('changeName',function(evt,msg) {
                accountInfo.accountName = msg;
                broadcast('_changeName',msg);
            });
            //聊天计数事件
            var totalChatNum = 0;
            var lastChatNum = 0;
            $scope.$on('msgChange', function() {
                if($scope.curNav != 'chatroom') {
                    totalChatNum++
                    if(totalChatNum <= 99) {
                        $scope.chatObj.messageNum = totalChatNum.toString();
                    }
                    else {
                        $scope.chatObj.messageNum = '99+';    
                    }
                    $scope.$digest();
                }
                else {
                    totalChatNum = 0; 
                    $scope.chatObj.messageNum = '';
                    $scope.$digest();
                }
            });
            $scope.modNav =  function(evt) {
                this.tar = evt.target.attributes.data.value;
                if(this.tar == 'chatroom') {
                		document.title = '聊天室 -喵喵熊';
                    $scope.chat = true;
                    totalChatNum = 0;
                    $scope.chatObj.messageNum = '';
                }
                else {
                    $scope.chat = false;
                }
                $scope.noservice = true;
                $scope.curNav = this.tar; 
            };
            $scope.modNav2 =  function(evt) {
                this.tar = evt.target.attributes.data.value;
                $scope.noservice = false;
                $scope.chat = false;
                $scope.curNav = this.tar; 
            };

            $scope.logout = function() {
            		document.title = '喵喵熊 妙生活';
                authorization.clearCredentials();
                $http.get(host + '/merchant/logout')
                .success(function(resData) {
        
                })
                .error(function(data) {
                    
                });
                $scope.$broadcast('logout');
                $location.path('/index');
            };
            getHimage();
            analyseStatus();
            analysePath();
    }]);    
});
