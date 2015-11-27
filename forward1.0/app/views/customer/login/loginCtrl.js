'use strict';

define(['angular', 'app', 'md5', 'services/authorization', 'services/rememberMe'], function (angular, app) {
    app.controller('cmLoginCtrl', ['$scope', '$rootScope', '$http', '$location', 'authorization', 'remember', 'FileUploader',
        function ($scope, $rootScope, $http, $location, authorization, remember, FileUploader) {
            /*
             var userInfo = $scope.userInfo = {};
             userInfo.login = function() {
             $location.path('/customer/account');
             console.log('ipaddress,' + returnCitySN.cip);
             };*/
            document.title = '喵喵熊登录';
            var host = $rootScope.proxyUrl;
            var loginUrl = host + '/user/login';
            var expires = 0; //cookie过期时间
            var loginData = {};
            var cookieData = {};
            //reset login status
//                authorization.clearCredentials();
            //view中使用的用户信息
            var userInfo = $scope.userInfo = {};
            //获取的用户信息数据
            var accData = {};
            // 警告框信息
            var _alert = $scope._alert = {};
            $scope.logSucceed = true;
            $scope.remember = false; //默认不记住密码
            var alertLoginFailed = {type: 'danger'},
                accErrMsg = '用户名或密码错误!',
                forbidMsg = '请先退出当前登录用户,重新登录';
            _alert.alerts = [];
            _alert.alerts.push(alertLoginFailed);
            _alert.closeAlert = function (index) {
                _alert.alerts.splice(index, 1);
            };
            $scope.changeLoginTab = function () {
                console.log('mer');
                $location.path('/merchant/login');
            };
            var accPattern = new RegExp("^([a-zA-Z])");
            var isLetter = function (acc) {
                if (accPattern.exec(acc)) {
                    return true;
                }
                return false;
            };
            var fillLoginData = function (acc, psw) {
                if (isLetter(acc)) {
                    loginData.mode = 1;
                    loginData.account = acc;
                }
                else {
                    loginData.mode = 2;
                    loginData.phone = acc;
                }
                loginData.password = psw;
                loginData.dev = returnCitySN.cip; //ipaddress
                loginData.type = 4;
            };
            var fillAccData = function () {
                var accUrl = host + '/user/personal';
                console.log('getAccData');
                $http.get(accUrl)
                    .success(function (data) {
                        if (data.err == 0) {
                            console.log('err = 0');
                            accData = data.info;
                            cookieData.accType = 'cm';
                            cookieData.username = accData.name;
                            cookieData.password = userInfo.passwd;
                            cookieData.portrait = accData.portrait;
                            //是否选择记住密码
                            if ($scope.remember) {
                                expires = 30;
                            }
                            console.log('usernameeeee,' + accData.name);
                            authorization.setCredentials(cookieData, expires);
                            $rootScope.globals = remember.get('globals') || {};
                            console.log($rootScope.globals);
                            $location.path('/customer/account');
                        }
                    }).error();
                /*
                 if(accData) {
                 return true;
                 }
                 else {
                 return false;
                 }*/
            };
            //用户登录
            userInfo.login = function () {
                if(remember.get('globals')) {
                    console.log('globalsssssssssssss');
                    $scope.logSucceed = false;
                    alertLoginFailed.msg = forbidMsg;
                    if(_alert.alerts.length == 0) {
                        _alert.alerts.push(alertLoginFailed);
                    }
                    return;
                }
                var success = function (resData) {
                    console.log('post success');
                    $scope.logSucceed = true;
                    if (resData.err == 0) {
                        $scope.logSucceed = true;
                        $scope.acc = resData;
                        cookieData.userID = resData.accID;
                        fillAccData();
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
                var error = function (resData) {
                    $scope.err = resData;
                };
                fillLoginData(userInfo.name, userInfo.passwd);
                authorization.login(loginUrl, loginData).success(success).error(error);
            };

            /*QC.Login({
                btnId: "qqLoginBtn"	//插入按钮的节点id
            });*/

        }]);
});
