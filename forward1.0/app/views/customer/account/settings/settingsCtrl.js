'use strict';

define(['angular', 'app', 'md5', 'services/authorization', 'qrcode', 'services/checkcookie'], function (angular, app) {
    app.controller('settings', ['$scope', '$rootScope', 'authorization', '$http', '$modal', 'FileUploader', '$timeout', '$interval','hascookie',
        function ($scope, $rootScope, authorization, $http, $modal, FileUploader, $timeout, $interval, hascookie) {
            document.title = '用户设置 -喵喵熊'
            var host = $rootScope.proxyUrl;

            var getInfo = $scope.getInfo = function () {
                $http({
                    url: host + "/user/personal",
                    method: "GET"
                }).success(function (data) {
                    console.log(data);
                    if (data.err == 0) {
                        $scope.personal = data.info;
                        if ($scope.personal.gender == null) {
                            $scope.personal.gender = 0;
                        }
                        if ($scope.personal.city) {
                            $http({
                                url: host + "/basic/city/" + $scope.personal.city,
                                method: "GET"
                            }).success(function (data) {
                                $scope.personal.province = data.province_id;
                                getCitys($scope.personal.province);
                            });
                        } else {
                            $scope.personal.province = 0;
                        }
                        $scope.$watch("personal.city", function () {
                            saveInfo(4);
                        });
                    }
                })
            };
            getInfo();

            var changeName = $scope.changeName = function(name){
                if(hascookie.check('cm')){
                $scope.$emit('changeName', name);
                }
            };

            var saveInfo = $scope.saveInfo = function (attr) {
                if(hascookie.check('cm')){
                $http({
                    url: host + "/user/personal",
                    method: "POST",
                    data: {
                        attr: attr,
                        name: $scope.personal.name,
                        portrait: $scope.personal.portrait,
                        gender: $scope.personal.gender,
                        city: $scope.personal.city
                    }
                }).success(function (data) {
                    console.log(data)
                })
            }};

            // 城市
            var getProvinces = $scope.getProvinces = function () {
                $http({
                    url: host + '/basic/provinces?all=1',
                    methos: "GET"
                }).success(function (data) {
                    $scope.this_province = data.provinces;
                });
            };
            getProvinces();

            var getCitys = $scope.getCitys = function (province_id) {
                $http({
                    url: host + '/basic/cities?all=1&province_id=' + String(province_id),
                    method: "GET"
                }).success(function (data) {
                    $scope.this_city = data.cities;
                });
                return false;
            };

            var getCitysAndSet = $scope.getCitysAndSet = function (province_id) {
                $http({
                    url: host + '/basic/cities?all=1&province_id=' + String(province_id),
                    method: "GET"
                }).success(function (data) {
                    $scope.this_city = data.cities;
                    $scope.personal.city = $scope.this_city[0].city_id;
                });
                return false;
            };

            $scope.this_gender = [
                {label: '男', id: 1},
                {label: '女', id: 2},
                {label: '秘密', id: 0}
            ];

            // 收获地址
            var getAddress = $scope.getAddress = function () {
                $http({
                    url: host + '/user/address',
                    method: "GET"
                }).success(function (data) {
                    $scope.addressList = data.addressList.sort(function (a, b) {
                        return a.default < b.default;
                    });
                    console.log($scope.addressList)
                })
            };
            getAddress();

            // 设置默认地址
            var setDefaultAddress = $scope.setDefaultAddress = function (addrID) {
                if(hascookie.check('cm')){
                $http({
                    url: host + '/user/address/default',
                    method: "POST",
                    data: {
                        addrID: addrID
                    }
                }).success(function (data) {
                    getAddress();
                })
            }};
            // 删除地址
            var deleteAddress = $scope.deleteAddress = function (addrID, d) {
                if(hascookie.check('cm')){
                $http({
                    url: host + '/user/address',
                    method: "DELETE",
                    data: {
                        addrID: addrID
                    }
                }).success(function (data) {

                    $http({
                        url: host + '/user/address',
                        method: "GET"
                    }).success(function (data) {
                        $scope.addressList = data.addressList.sort(function (a, b) {
                            return a.default < b.default;
                        });
                        if ($scope.addressList.length > 0) {
                            if (d == 1) {
                                setDefaultAddress($scope.addressList[0].addrID)
                            }
                        }
                    });
                })
            }};

            // 头像上传
            var uploader = $scope.uploader = new FileUploader({
                url: "http://" + $rootScope._chatProxyUrl + '/file/uploader',
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
                    $scope.personal.portrait = resData.url;
                    $scope.$emit('changeHead', resData.url);
                    $scope.small_portrait_url = resData.url + "@100w_100h.jpg";
                    saveInfo(2)
                }
            };

            uploader.onCompleteAll = function () {
                $scope.inupload = false;
            };

            var popphone = $scope.popphone = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/customer/account/settings/popphone.html',
                    controller: ['$scope', '$modalInstance', '$http', 'phone', function ($scope, $modalInstance, $http, phone) {
                        $scope.sended = false;
                        $scope.phone = phone;
                        $scope.captcha_url = host + "/basic/captcha";

                        $scope.refreshCaptcha = function () {
                            $scope.captcha_url = host + "/basic/captcha?rnd=" + String(Math.random())
                        };

                        $scope._cancel = function() {
                            $modalInstance.close();
                        };

                        $scope._confirm = function () {

                            $scope.submitted = true;

                            $http({
                                url: host + "/user/bindphone",
                                method: "POST",
                                data: {
                                    phone: $scope.newPhone
                                }
                            }).success(function (data) {
                                if (data.err === 0) {
                                    $modalInstance.close($scope.newPhone);
                                }
                            });

                        };

                        $scope.validsuccess = true;
                        $scope.validcaptcha = function () {
                            $http({
                                url: host + "/basic/captcha",
                                method: "POST",
                                data: {
                                    captcha_str: $scope.captcha
                                }
                            }).success(function (data) {
                                if (data.is_success) {
                                    $scope.validsuccess = true;
                                    return true;
                                } else {
                                    $scope.validsuccess = false;
                                    return false;
                                }
                            });
                        };

                        $scope.phoneValidsuccess = true;
                        $scope.sendPhoneValid = function () {
                            if(hascookie.check('cm')){
                            $http({
                                url: host + "/basic/phonevalidate/" + $scope.phone,
                                method: "GET"
                            }).success(function (data) {
                                $scope.sended = true;
                                $scope.time = 60;

                                $interval(function () {
                                    if ($scope.time > 1) {
                                        $scope.time = $scope.time - 1;
                                    }
                                    else {
                                        $scope.sended = false;
                                        $scope.time = 60;
                                    }
                                }, 1000, 60);


                                console.log(data);
                            });
                        }};
                        $scope.validPhoneCaptcha = function () {
                            if(hascookie.check('cm')){
                            $http({
                                url: host + "/basic/phonevalidate/" + $scope.phone,
                                method: "POST",
                                data: {
                                    code: $scope.phoneCaptcha
                                }
                            }).success(function (data) {
                                if (data.is_success) {
                                    $scope.phoneValidsuccess = true;
                                } else {
                                    $scope.phoneValidsuccess = false;
                                }
                            });
                        }};

                        $scope.submitted = false;
                        $scope.submitForm = function () {
                            $scope.submitted = true;
                            
                            $http({
                                url: host + "user/bindphone",
                                method: "POST",
                                data: {
                                    phone: $scope.newPhone
                                }
                            }).success(function (data) {
                                if (data.err === 0) {
                                    $modalInstance.close();
                                }
                            });
                        }

                    }],
                    resolve: {
                        host: function () {
                            return $scope.host;
                        },
                        phone: function () {
                            return $scope.personal.phone
                        }
                    },
                    size: 'lg',
                    windowClass: 'mag-pop-modal',
                    backdropClass: 'modal-backdrop'
                });
                modalInstance.result.then(function (phone) {
                    if(phone){
                        $scope.personal.phone = phone;
                    }
                });
            };


            var popnewphone = $scope.popnewphone = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/customer/account/settings/newphone.html',
                    controller: ['$scope', '$modalInstance', '$http', function ($scope, $modalInstance, $http) {
                        $scope.captcha_url = host + "/basic/captcha";

                        $scope.refreshCaptcha = function () {
                            $scope.captcha_url = host + "/basic/captcha?rnd=" + String(Math.random())
                        };

                        $scope._confirm = function () {

                            $scope.submitted = true;

                            $http({
                                url: host + "/user/bindphone",
                                method: "POST",
                                data: {
                                    phone: $scope.newPhone
                                }
                            }).success(function (data) {
                                if (data.err === 0) {
                                    $modalInstance.close($scope.newPhone);
                                }
                            });

                        };

                        $scope._cancel = function() {
                            $modalInstance.close();
                        };

                        $scope.validsuccess = false;
                        $scope.validcaptcha = function () {
                            if ($scope.captcha.length >= 4 || $scope.validsuccess) {
                                if(hascookie.check('cm')){
                                $http({
                                    url: host + "/basic/captcha",
                                    method: "POST",
                                    data: {
                                        captcha_str: $scope.captcha
                                    }
                                }).success(function (data) {
                                    if (data.is_success) {
                                        $scope.validsuccess = true;
                                        return true;
                                    } else {
                                        $scope.validsuccess = false;
                                        return false;
                                    }
                                });
                            }}
                        };

                        $scope.phoneValidsuccess = false;
                        $scope.hasphoneValidsuccess = false;
                        $scope.sendPhoneValid = function () {
                            $http({
                                url: host + "/basic/phonevalidate/" + $scope.newPhone,
                                method: "GET"
                            }).success(function (data) {
                                $scope.sended = true;
                                $scope.time = 60;

                                $interval(function () {
                                    if ($scope.time > 1) {
                                        $scope.time = $scope.time - 1;
                                    }
                                    else {
                                        $scope.sended = false;
                                        $scope.time = 60;
                                    }
                                }, 1000, 60);
                            });
                        };
                        $scope.validPhoneCaptcha = function () {
                            if ($scope.phoneCaptcha.length >= 6 || $scope.hasphoneValidsuccess) {
                                $http({
                                    url: host + "/basic/phonevalidate/" + $scope.newPhone,
                                    method: "POST",
                                    data: {
                                        code: $scope.phoneCaptcha
                                    }
                                }).success(function (data) {
                                    if (data.is_success) {
                                        $scope.phoneValidsuccess = true;
                                    } else {
                                        $scope.phoneValidsuccess = false;
                                    }
                                    $scope.hasphoneValidsuccess = true;
                                });
                            }
                        };

                        $scope.submitted = false;
                        $scope.submitForm = function () {
                            $scope.submitted = true;
                            $http({
                                url: host + "user/bindphone",
                                method: "POST",
                                data: {
                                    phone: $scope.newPhone
                                }
                            }).success(function (data) {
                                console.log(data)
                                if (data.err === 0) {
                                    $modalInstance.close();
                                }
                            });
                        }

                    }],
                    resolve: {
                        host: function () {
                            return $scope.host;
                        }
                    },
                    size: 'lg',
                    windowClass: 'mag-pop-modal',
                    backdropClass: 'modal-backdrop'
                });
                modalInstance.result.then(function (phone) {
                    if(phone){
                        $scope.personal.phone = phone;
                    }
                });
            };

            var popnewaddress = $scope.popnewaddress = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/customer/account/settings/address.html',
                    controller: ['$scope', '$modalInstance', '$http', function ($scope, $modalInstance, $http) {

                        $scope._confirm = function () {

                            $scope.submitted = true;

                            $http({
                                url: host + "/user/address",
                                method: "PUT",
                                data: {
                                    name: $scope.name,
                                    phone: $scope.phone,
                                    address: $scope.address,
                                    postcode: $scope.code,
                                    province_id: $scope.province,
                                    city_id: $scope.city
                                }
                            }).success(function (data) {
                                if (data.err === 0) {
                                    $modalInstance.close();
                                }
                            });

                        };
                        $scope._cancel = function() {
                            $modalInstance.close();
                        };


                        var getProvinces = $scope.getProvinces = function () {
                            $http({
                                url: host + '/basic/provinces',
                                methos: "GET"
                            }).success(function (data) {
                                $scope.this_province = data.provinces;
                                $scope.province = $scope.this_province[0].province_id
                                getCitys($scope.province)
                            });
                        };
                        getProvinces();

                        var getCitys = $scope.getCitys = function (province_id) {
                            $http({
                                url: host + '/basic/cities?province_id=' + String(province_id),
                                method: "GET"
                            }).success(function (data) {
                                $scope.this_city = data.cities;
                                $scope.city = $scope.this_city[0].city_id
                            });
                            return false;
                        };

                    }],
                    resolve: {
                        host: function () {
                            return $scope.host;
                        }
                    },
                    size: 'lg',
                    windowClass: 'mag-pop-modal',
                    backdropClass: 'modal-backdrop'
                });
                modalInstance.result.then(function () {
                    getAddress();
                });
            };


            var popmodifyaddress = $scope.popmodifyaddress = function (address) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/customer/account/settings/modifyaddress.html',
                    controller: ['$scope', '$modalInstance', '$http', function ($scope, $modalInstance, $http) {
                        $scope.name = address.name;
                        $scope.phone = address.phone;
                        $scope.address = address.address;
                        $scope.postcode = address.postcode;
                        $scope.addrID = address.addrID;
                        $scope.province = address.province_id;
                        $scope.city = address.city_id;


                        $scope._confirm = function () {

                            $scope.submitted = true;

                            $http({
                                url: host + "/user/address",
                                method: "POST",
                                data: {
                                    addrID: $scope.addrID,
                                    name: $scope.name,
                                    phone: $scope.phone,
                                    address: $scope.address,
                                    postcode: $scope.postcode,
                                    province_id: $scope.province,
                                    city_id: $scope.city
                                }
                            }).success(function (data) {
                                if (data.err === 0) {
                                    $modalInstance.close();
                                }
                            });

                        };

                        $scope._cancel = function() {
                            $modalInstance.close();
                        };

                        var getProvinces = $scope.getProvinces = function () {
                            $http({
                                url: host + '/basic/provinces',
                                methos: "GET"
                            }).success(function (data) {
                                $scope.this_province = data.provinces;
                                getCitys($scope.province)
                            });
                        };
                        getProvinces();

                        var getCitys = $scope.getCitys = function (province_id) {
                            $http({
                                url: host + '/basic/cities?province_id=' + String(province_id),
                                method: "GET"
                            }).success(function (data) {
                                $scope.this_city = data.cities;
                                //$scope.city = $scope.this_city[0].city_id
                            });
                            return false;
                        };

                        var getCitysAndSet = $scope.getCitysAndSet = function (province_id) {
                            $http({
                                url: host + '/basic/cities?province_id=' + String(province_id),
                                method: "GET"
                            }).success(function (data) {
                                $scope.this_city = data.cities;
                                $scope.city = $scope.this_city[0].city_id;
                            });
                            return false;
                        };

                    }],
                    resolve: {
                        host: function () {
                            return $scope.host;
                        }
                    },
                    size: 'lg',
                    windowClass: 'mag-pop-modal',
                    backdropClass: 'modal-backdrop'
                });
                modalInstance.result.then(function () {
                    getAddress();
                });
            };


        }
    ])
});
