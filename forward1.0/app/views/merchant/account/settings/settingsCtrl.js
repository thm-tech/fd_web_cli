'use strict';


define(['angular', 'app', 'md5', 'services/authorization', 'services/checkcookie'], function (angular, app) {
    app.controller('accountManagement', ['$scope', '$rootScope', 'authorization', '$http', '$modal', 'FileUploader', '$timeout','hascookie',
        function ($scope, $rootScope, authorization, $http, $modal, FileUploader, $timeout, hascookie) {

            document.title = "用户信息 -喵喵熊";

            var shop_id = $rootScope.globals.shop_id;
            var host = $rootScope.proxyUrl;
            var chathost = "http://" + $rootScope._chatProxyUrl;

            $scope.account = $rootScope.globals.username;

            $scope.resultinfo = {};
            $scope.resultinfo.yes = false;
            $scope.resultinfo.des = "";

            $scope.pwd_equal = true;
            $scope.repwd = function () {
                if ($scope.renew_password === $scope.new_password) {
                    $scope.pwd_equal = true;
                } else {
                    $scope.pwd_equal = false;
                }
            };

            $scope.savepwd = function (valid) {
                if(hascookie.check('mt')){
                if (valid) {
                    console.log(hex_md5($scope.old_password));
                    $http({
                        url: host + "/merchant/" + shop_id + "/password",
                        data: {
                            'shop_id': shop_id,
                            'old_password': hex_md5($scope.old_password),
                            'new_password': hex_md5($scope.new_password)
                        },
                        method: "PUT"
                    }).success(function (data) {
                        if (data.is_success) {
                            $scope.result = '修改成功, 您的密码已经更新'
                        } else {
                            $scope.result = '修改失败, 请确认当前密码输入无误'
                        }
                    });
                    $scope.modify_password_showtoggle = true
                }}
            };

            $scope.save = function (index) {
                if(hascookie.check('mt')){
                $http({
                    url: host + "/merchant/" + shop_id + "/info",
                    data: {
                        'contact_name': $scope.name,
                        'contact_phone_no': $scope.phone,
                        'contact_email': $scope.email,
                        'contact_qq': $scope.qq,
                        'portrait_url': $scope.portrait_url
                    },
                    method: "POST"
                }).success(function (data) {
                    $scope.resultinfo.yes = index;
                    if ($scope.start_portrait_url != $scope.portrait_url) {
                        $scope.$emit('changeHead', $scope.portrait_url)
                    }
                    if ($scope.start_name != $scope.name){
                        $scope.$emit('changeName', $scope.name)
                    }
                    if (data.is_success) {
                        $scope.resultinfo.des = "修改成功";
                    } else {
                        getMerchantInfo();
                        $scope.resultinfo.des = "服务器压力山大, 请稍后重试";
                    }
                    $timeout(function () {
                        $scope.resultinfo.yes = 0;
                    }, 3000)

                })}
            };

            var getMerchantInfo = function () {
                $http({
                    url: host + "/merchant/" + shop_id + "/info",
                    method: "GET"
                }).success(function (data) {
                    $scope.name = data.contact_name;
                    $scope.start_name = $scope.name;
                    $scope.phone = data.contact_phone_no;
                    $scope.email = data.contact_email;
                    $scope.qq = data.contact_qq;
                    $scope.portrait_url = data.portrait_url
                    $scope.start_portrait_url = data.portrait_url
                    $scope.small_portrait_url = data.portrait_url + "@65w_65h.jpg";

                });
            };
            getMerchantInfo();


            var uploader = $scope.uploader = new FileUploader({
                url: chathost + '/file/uploader',
                autoUpload: true
            });
            uploader.filters.push({
                name: 'imageFilter',
                fn: function (item, options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            });

            uploader.onAfterAddingFile = function (fileItem) {
                console.info('onAfterAddingFile', fileItem);
                $scope.is_show = false;
                $scope.inupload = true;
            };

            uploader._onSuccessItem = function (fileItem, resData, status, headers) {
                console.log('successupload,' + resData.url);
                if (resData.url) {
                    $scope.portrait_url = resData.url;
                    $scope.small_portrait_url = resData.url + "@100w_100h.jpg";
                    $scope.save();

                }
            };

            uploader.onCompleteAll = function () {
                $scope.inupload = false;
            };

        }
    ]);
});
