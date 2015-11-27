'use strict';

define(['angular','app','md5','services/authorization','services/rememberMe'], function(angular,app) {
        app.controller('mtLoginCtrl', ['$scope','$rootScope','$location','authorization','remember', 
            function($scope,$rootScope,$location,authorization,remember) {   
            		document.title = '喵喵熊商家登录';
                var loginUrl = $rootScope.proxyUrl + '/merchant/login';
                var expires = 0; //cookie过期时间
                var loginData = {};
                var cookieData = {};
                //reset login status
//                authorization.clearCredentials();
                //用户信息
                var userInfo = $scope.userInfo = {};
               // 警告框信息
                var _alert = $scope._alert = {};
                $scope.logSucceed = true;
                $scope.remember = false; //默认不记住密码
                var alertLoginFailed = {type: 'danger'},
                    accErrMsg = '用户名或密码错误!',
                    forbidMsg = '请先退出当前登录用户,重新登录';
                _alert.alerts = [];
                _alert.alerts.push(alertLoginFailed);
                _alert.closeAlert = function(index) {
                        _alert.alerts.splice(index,1);
                };

                $scope.changeLoginTab = function(){
                    console.log('cus');
                    $location.path('/customer/login');
                };

                //用户登录
                userInfo.login = function() { 
                    if(remember.get('globals')) {
                        console.log('globalsssssssssssss');
                        $scope.logSucceed = false;
                        alertLoginFailed.msg = forbidMsg;
                        if(_alert.alerts.length == 0) {
                            _alert.alerts.push(alertLoginFailed);
                        }
                        return;
                    }
                    var success = function(resData) {
                        console.log('post success');
                        $scope.logSucceed = true;
                        $scope.storeInfo = resData;
                        if (resData.is_success) {
                            console.log('usernameeeee,' + authorization._credentials.account);
                            $scope.logSucceed = true;
                            $scope.storeInfo = resData;
                            //是否选择记住密码
                            if($scope.remember) {
                                expires = 30;
                            }
                            cookieData = {
                                shop_id:$scope.storeInfo.shop_id,
                                merchant_service_status:resData.merchant_service_status,
                                accType:'mt',
                                username:userInfo.name,
                                password:userInfo.passwd
                            };
                            authorization.setCredentials(cookieData,expires);
                            $rootScope.globals = remember.get('globals') || {};
                            $location.path('/merchant/account');
                        }
                        else {
                            console.log('failed,' + resData.error_code);
                            $scope.logSucceed = false;
                            alertLoginFailed.msg = accErrMsg;
                        }
                        if (_alert.alerts.length == 0) {
                            _alert.alerts.push(alertLoginFailed);
                        }
                    };
                    var error = function(resData) {
                        $scope.err = resData;
                    };
                    loginData.account = userInfo.name;
                    loginData.password = userInfo.passwd;
                    loginData.type = 5;
                    authorization.login(loginUrl,loginData).success(success).error(error);
                };
            }]);
    });
