'use strict';

define(['angular','app','md5'], function(angular,app) {
    app.controller('resetPsw',['$scope','$rootScope','$http','$interval', function($scope,$rootScope,$http,$interval) {
    		document.title = '忘记密码 -喵喵熊';
        var reset = $scope.reset = {};
        var host = $rootScope.proxyUrl;
        //确认账号
        reset.account = {};
        //身份验证
        reset.verity = {};
        //重置密码
        reset.resetPsw = {};

        $scope.shop_id = 0;

        reset.templateUrl = 'views/customer/resetPsw/tpls/account.html';
        var host = $rootScope.proxyUrl;
//        var randNum = Math.random();
        var randNum = Math.random();
        reset.account.imgCaptchaUrl = host + '/basic/captcha?rnd=' + randNum;
        console.log('randurl,' + reset.account.imgCaptchaUrl);

        var accPattern = new RegExp("^([a-zA-Z]|[\u4E00-\u9FA5]|[\uFE30-\uFFA0])"); //英文字母或汉子开头
        
        reset.account.changeCaptcha = function() {
            randNum = Math.random();
            reset.account.imgCaptchaUrl = host + '/basic/captcha?rnd=' + randNum;
        };
        reset.account.accountblur = false;
        reset.account.accountBlur = function() {
            if (!reset.account.account) {
                reset.account.accountblur = true;
            }
            else {
                if (accPattern.exec(reset.account.account)) {
                    console.log('accountttttt,yes');
                }
                else {
                    console.log('accountttt,no');    
                }
            }
        };
        reset.account.accountFocus = function() {
            reset.account.accountblur = false;
        };
        reset.account.captchablur = false;
        reset.account.captchaBlur = function() {
            if (!reset.account.captcha) {
                reset.account.captchablur = true;
            }
        };
        reset.account.captchaFocus = function() {
            reset.account.captchablur = false;
            reset.account.errCap = false;
        };
        reset.account.errCap = false;  //验证码错误提示标记
        reset.account.verityCaptcha = function() {
            var capUrl = host + '/basic/captcha';
            console.log('capurl,' + capUrl);
            var capData = {rnd:randNum,captcha_str:reset.account.captcha};
            if(reset.account.captcha) {
                if (reset.account.captcha.length >= 4) {
                    $http(
                        {
                            url:capUrl,
                            method:'POST',
                            data:capData
                        }
                    ).success(function(resData) {
                    if (resData.is_success) {
                        console.log('capsuccess');
                        reset.account.errCap = false;
                    }
                    else {
                        reset.account.errCap = true;    
                    }
                }).error(function () {});
              }
                else {
                    reset.account.errCap = false;    
              }
            }
            else {
                reset.account.errCap = false;    
            }
        };
        reset.account.postAccount = function() {
            var accUrl = host + '/merchant/forgetpassword?step=is_account_exist&acc_or_pho=' + reset.account.account;
            $http.get(accUrl).success(function(resData) {
                if (resData.is_exist) {
                    reset.verity.phoneNum = resData.phone;
                    $scope.shop_id = resData.shop_id;
                    reset.templateUrl = 'views/customer/resetPsw/tpls/verity.html';
                }
                else {
                    console.log('account is not exist');    
                }
            }).error(function(status) {
                console.log('status,' + status);
            });
        };


        reset.verity.noteblur = false;
        reset.verity.noteBlur = function() {
            if (!reset.verity.note) {
                reset.verity.noteblur = true;
            }
        };
        reset.verity.noteFocus = function() {
            reset.verity.noteblur = false;
            reset.verity.noteErr = false;
        };

        reset.verity.postNote = function() {
            var verityUrl = host + '/merchant/forgetpassword';
            var verityData = {step:'validate_phone_captcha',phone_captcha:reset.verity.note,phone:reset.verity.phoneNum};
            console.log('noteeeee,' + verityData.phone_captcha);
            $http({
                url:verityUrl,
                method:'POST',
                data:verityData
            }).success(function(resData) {
                if(resData.is_success) {
                    reset.templateUrl = 'views/customer/resetPsw/tpls/reset.html';
                }
                else {
                    reset.verity.noteErr = true;
                }
            }).error(function() {
                
            });
        };
        reset.verity.clicked = false;//未点击获取验证码
        reset.verity.noteErr = false;
        reset.verity.sCount = 60;   //60s
        reset.verity.reSend = '重新发送' + '(' + reset.verity.sCount + ')';
        reset.verity.getNote = function() {
            var getNoteUrl = host + '/merchant/forgetpassword?step=get_phone_captcha&phone=' + reset.verity.phoneNum;
            reset.verity.clicked = true;
            $interval(function(){
                if (reset.verity.sCount > 1) {
                    reset.verity.sCount = reset.verity.sCount - 1;    
                    console.log('cnttttt,' + reset.verity.sCount);
                }
                else {
                    reset.verity.clicked = false;
                    reset.verity.sCount = 60;
                }
            },1000,60);

            $http.get(getNoteUrl).success(function(resData) {
                if (resData.is_success) {
                    $scope.note = resData.captcha;
                }
            }).error();
        };
        $scope.$watch('reset.verity.sCount',function(newVal) {
            console.log('kkkkkddd');
            reset.verity.reSend = '重新发送' + '(' + reset.verity.sCount + ')';    
        });


        reset.resetPsw.incons = false; //密码一致性验证
        reset.resetPsw.newblur = false;//输入新密码框焦点
        reset.resetPsw.newBlur = function() {
            if (!reset.resetPsw.newPsw) {
                reset.resetPsw.newblur = true;
            }
        };
        reset.resetPsw.newFocus = function() {
            reset.resetPsw.newblur = false;
        };
        reset.resetPsw.reblur = false;//确认新密码框焦点
        reset.resetPsw.reBlur = function() {
            if (!reset.resetPsw.rePsw) {
                reset.resetPsw.reblur = true;
            }
            if (reset.resetPsw.newPsw && reset.resetPsw.rePsw && reset.resetPsw.newPsw != reset.resetPsw.rePsw) {
                reset.resetPsw.incons = true;
            }
        };
        reset.resetPsw.reFocus = function() {
            reset.resetPsw.reblur = false;
            reset.resetPsw.incons = false;
        };
        reset.resetPsw.postReset = function() {
            var reUrl = host + '/merchant/forgetpassword';
            if (reset.resetPsw.newPsw != reset.resetPsw.rePsw) {
                reset.resetPsw.incons = true;
            }
            else {
                var reData = {step:'reset_password',shop_id:$scope.shop_id,new_password:hex_md5(reset.resetPsw.newPsw)};
                $http({
                    url:reUrl,
                    method:'POST',
                    data:reData
                }).success(function(resData) {
                    if(resData.is_success) {             
                        reset.templateUrl = 'views/customer/resetPsw/tpls/complete.html';
                    }
                }).error(function() {
                    
                });
            }
        };
    }]);    
});
