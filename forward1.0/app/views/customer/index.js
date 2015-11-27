define(['angular', 'app', 'md5', 'services/authorization', 'qrcode'], function (angular, app) {
    app.controller('index', ['$http','$rootScope',
            function ($http) {
                var URL = document.location.href;
                var match = URL.match('code=\\w+');

                if (match) {
                    var code = match[0].split('=')[1];

                    $http({
                        url: $rootScope.proxyUrl + "/thirdlogin/wechat?code=" + code,
                        method: "GET"
                    }).success(function (data) {
                        data = JSON.parse(data);
                        if (data.errcode) {
                        } else {
                            var access_token = data.access_token;
                            var open_id = data.openid;
                            $http({
                                url: $rootScope.proxyUrl + "/user/loginex",
                                method: "POST",
                                data: {
                                    mode: 5,
                                    type: 4,
                                    openID: open_id,
                                    dev: ""
                                }
                            }).success(function (data) {
                                var loginex_data = data;
                                if (!data.err) {
                                    console.log('third login success');

                                    if (true) {
                                        // Get WeChat Info

                                        $http({
                                            url: $rootScope.proxyUrl + "/thirdlogin/wechat/info?access_token=" + access_token + "&openid=" + open_id,
                                            method: "GET"
                                        }).success(function (data) {
                                            data = JSON.parse(data);

                                            $http({
                                                url: $rootScope.proxyUrl+"/user/personal",
                                                method: "POST",
                                                data: {
                                                    attr: 1,
                                                    name: data.nickname
                                                }
                                            }).success(function (data) {
                                            });
                                        });
                                    }
                                    // Set Cookie

                                    // Set Cookie End

                                    //                            document.location.href = 'http://115.28.143.67:8989/#/customer/account/shops';
                                } else {
                                    // third login failed
                                }
                            });
                        }
                    });
                }

            }]
    );
});
