'use strict';

define(['angular','app','md5'], function(angular,app) {
    app.controller('cmregisterCtrl', ['$scope','$rootScope','$http','$location','$interval', 
        function($scope,$rootScope,$http,$location,$interval) {
            var user = $scope.user = {};
            var host = $rootScope.proxyUrl;
            var getCodeUrl = host + '/user/gencode';
            var verCodeUrl = host + '/user/vercode';
            var registerUrl = host + '/user/register';
            user.clicked = false;
            user.codeErr = false;
            user.sCount = 60;
            user.mphone = '';
            user.reSend = '重新发送' + '(' + user.sCount + ')';
            $scope.$watch('user.sCount', function(newVal) {
                user.reSend = '重新发送' + '(' + user.sCount + ')';
            });
            user.getCode = function() {
                if(!user.errPho) {
                    user.clicked = true;
                    $interval(function() {
                        if(user.sCount > 1) {
                            --user.sCount;
                        } 
                        else {
                            user.clicked = false;
                            user.sCount = 60;
                        }
                    },1000,60);
                    $http({
                        url:getCodeUrl,
                        method:'post',
                        data:{'phone':user.mphone}
                    })
                    .success(function(data) {
                        
                    })
                    .error();
                }
            };
            var verCode = function() {
                if(user.code) {
                    $http({
                        url:verCodeUrl,
                        method:'POST',
                        data: {'phone':user.mphone,'code':user.code}
                    })
                    .success(function(data) {
                        user.codeErr = data.err ? true : false;   
                    })
                    .error();
                }    
            };
           // 警告框信息
            var _alert = $scope._alert = {};
            $scope.regSucceed = true;
            var isExsitMsg = '此手机号已被注册';
            var regFailedMsg = '注册失败';
            var alertRegErr = {type: 'danger'};
            _alert.alerts = [];
            _alert.alerts.push(alertRegErr);
            _alert.closeAlert = function(index) {
                    _alert.alerts.splice(index,1);
            };
            user.register = function() {
                $http({
                    url:registerUrl,
                    method: 'POST',
                    data:{'phone':user.mphone,'password':hex_md5(user.password)}
                })
                .success(function(data) {
                    if(data.err == 0) {
                        $location.path('/customer/login');
                    }        
                    else if(data.err == 131075) {
                        $scope.regSucceed = false;
                        alertRegErr.msg = isExsitMsg;
                    }
                    else {
                        $scope.regSucceed = false; 
                        alertRegErr.msg = regFailedMsg;
                    }
                    if(_alert.alerts.length == 0) {
                        _alert.alerts.push(alertRegErr);
                    }
                }).error();
            };
            var emptyPhoMsg = '请输入您的手机号',
                errPhoMsg = '请输入正确的手机号';
            user.errPho = false;
            user.analysePho = function() {
                if(!user.mphone) {
                    console.log('empty');
                    user.errPho = true;
                    user.errPhoMsg = emptyPhoMsg;
                }
                else if(user.mphone.length != 11) {
                    console.log('no 11');
                    user.errPho = true;
                    user.errPhoMsg = errPhoMsg;
                }
                else {
                    if (!(/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(user.mphone))) {
                        console.log('err 11');
                        user.errPho = true;
                        user.errPhoMsg = errPhoMsg;
                    }
                }
                console.log('analyse');
            };
            user.rmMsg = function() {
                user.errPho = false;
            };
            
    }]);
        
});
