define(['angular', 'app', 'services/checkcookie'], function(angular, app) {
    app.controller('fanslist', ['$scope', '$http', '$rootScope', 'hascookie',
        function($scope, $http, $rootScope, hascookie) {

            document.title = "粉丝 -喵喵熊";

            var shop_id = $rootScope.globals.shop_id;
            var host = $rootScope.proxyUrl;

            $scope.show = {};
            $scope.show.should_i_show = 1;
            $scope.drop_down = function(fan) {
                $scope.$broadcast("drop_down", fan);
                $scope.show.should_i_show = 2
            };

            $scope.$on('drop_up', function(event, msg) {
                $scope.show.should_i_show = 1
            });

            $http({
                url: host + "/shop/" + shop_id + "/fans" + "?offset=0&limit=10000000000000",
                method: 'GET'
            }).success(function(data) {
                if (data.is_success) {
                    $scope.allfans = data.fans;
                }
            });

            $scope.page = {};
            $scope.init = function(pagenum) {
                if (pagenum == 0 || pagenum - 1 == $scope.page.page_num) {
                    return false
                }
                $scope.page.current_page = pagenum;
                $http({
                    url: host + "/shop/" + shop_id + "/fans" + "?offset=" + String(10 * (pagenum - 1)) + "&limit=10",
                    method: 'GET'
                }).success(function(data) {
                    if (data.is_success) {
                        $scope.fans = data.fans;
                        $scope.page.total_num = data.total_num;
                        $scope.page.page_num = Math.ceil($scope.page.total_num / 10);

                        $scope.page.plist_all = new Array($scope.page.page_num);
                        for (var i = 0; i < $scope.page.plist_all.length; i++) {
                            $scope.page.plist_all[i] = i + 1;
                        }

                        if ($scope.page.page_num < 5) {
                            $scope.page.plist = new Array($scope.page.page_num);
                            for (var i = 0; i < $scope.page.plist.length; i++) {
                                $scope.page.plist[i] = i + 1;
                            }
                        } else {
                            $scope.page.plist = new Array(5);
                            for (var i = 0; i < 5; i++) {
                                $scope.page.plist[i] = i + 1;
                            }
                            if ($scope.page.current_page > $scope.page.plist[4]) {
                                if ($scope.page.current_page < $scope.page.page_num - 1) {
                                    for (var i = 0; i < 5; i++) {
                                        $scope.page.plist[i] = $scope.page.plist[i] + $scope.page.current_page - $scope.page.plist[4] + 2;
                                    }
                                } else if ($scope.page.current_page < $scope.page.page_num) {
                                    for (var i = 0; i < 5; i++) {
                                        $scope.page.plist[i] = $scope.page.plist[i] + $scope.page.current_page - $scope.page.plist[4] + 1;
                                    }
                                } else {
                                    for (var i = 0; i < 5; i++) {
                                        $scope.page.plist[i] = $scope.page.plist[i] + $scope.page.current_page - $scope.page.plist[4];
                                    }
                                }
                            }
                        }
                    }
                })
            };
            $scope.init(1);

            $scope.is_current = function(index) {
                if (index == $scope.page.current_page) {
                    return true;
                } else {
                    return false;
                }
            };

            $scope.drop_g_down = function(fan) {
                $scope.$broadcast("drop_g_down", fan);
                $scope.show.should_i_show = 3;
            }
        }
    ]);


    app.controller('fanMsg', ['$scope', '$http', '$rootScope', '$sce', '$modal', 'hascookie',
        function($scope, $http, $rootScope, $sce, $modal, hascookie) {
            var shop_id = $rootScope.globals.shop_id;
            var host = $rootScope.proxyUrl;
            var msghost = $rootScope.chatProxyUrl;

            //$scope.ckcontent = null;

            $scope.$on('drop_down', function(event, msg) {
                $scope.fan = msg;
                $scope.show.should_i_show = 2;
            });

            $scope.$on('delect', function(event, msg) {
                $scope.show.should_i_show = 1;
            });

            $scope.drop_up = function() {
                $scope.show.should_i_show = 1;
                $scope.$emit('drop_up', null)
            };

            $scope.disable = true;

            document.domain = $rootScope.hostname;
            $scope.editorOptions = {
                filebrowserImageUploadUrl: msghost + '/ck/file/uploader'
            };

            $scope.isAvailableSend = function() {
                $.ajax({
                    url: host + "/merchant/" + shop_id + "/msgconfig",
                    async: false,
                    type: "GET"
                }).success(function(data) {
                    $scope.disable = true;
                    $scope.msgconfig = data;
                    if ($scope.msgconfig.p2p_remain_count > 0) {
                        $scope.disable = false;
                    }
                    $scope.ckcontent_holder = "本月粉丝点对点消息已发送" + String($scope.msgconfig.current_p2p_count - $scope.msgconfig.p2p_remain_count) + "条, 还可以发送" + String($scope.msgconfig.p2p_remain_count) + "条";
                })
            };
            $scope.isAvailableSend();


            var popInfo = function() {
                $scope.shop_id = shop_id;
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/merchant/account/fans/info.html',
                    controller: ['$scope', '$modalInstance', '$http', 'shop_id', function($scope, $modalInstance, $http, shop_id) {
                        $scope._confirm = function() {
                            $modalInstance.close();
                        };
                    }],
                    resolve: {
                        shop_id: function() {
                            return $scope.shop_id;
                        }
                    },
                    size: 'sm',
                    windowClass: 'pub-window',
                    backdropClass: 'modal-backdrop'
                });
                modalInstance.result.then(function() {});
            };

            $scope.send = function() {
                if (hascookie.check('mt')) {
                    var url = msghost + "/chat/" + String(shop_id) + "/fans/message/?uid=" + String($scope.fan.user_id);
                    $http({
                        url: url,
                        method: "POST",
                        data: $scope.ckcontent
                    }).success(function(data) {
                        $scope.isAvailableSend();
                        popInfo();
                        $scope.Content = '';
                    });

                    $http({
                        url: host + "/shop/" + shop_id + "/fansmessage",
                        data: {
                            "sendall": false,
                            "userids": String($scope.fan.user_id),
                            "message": $scope.ckcontent
                        },
                        method: "POST"
                    }).success(function(data) {})
                };
                $scope.isAvailableSend();
            }
        }
    ]);


    app.controller('focusG', ['$scope', '$http', '$rootScope', '$sce', 'hascookie',
        function($scope, $http, $rootScope, $sce, hascookie) {
            var shop_id = $rootScope.globals.shop_id;
            var host = $rootScope.proxyUrl;

            $scope.$on('drop_g_down', function(event, msg) {
                $scope.fan = msg;
                $scope.show.should_i_show = 3;

                $http({
                    url: host + "/customer/" + String($scope.fan.user_id) + "/shop/" + shop_id + "/info",
                    method: "get"
                }).success(function(data) {
                    $scope.fan_all_info = data;
                })
            });
        }
    ]);

    app.controller('sendall', ['$scope', '$http', '$rootScope', '$sce', '$modal', 'hascookie',
        function($scope, $http, $rootScope, $sce, $modal, hascookie) {
            var shop_id = $rootScope.globals.shop_id;
            var host = $rootScope.proxyUrl;
            var msghost = $rootScope.chatProxyUrl;

            //$scope.ckcontent = null;

            $scope.disable = true;

            document.domain = $rootScope.hostname;
            $scope.editorOptions = {
                filebrowserImageUploadUrl: "http://" + $rootScope._chatProxyUrl + '/ck/file/uploader',
                allowedContent: true,
                entities: false
            };

            $scope.isAvailableSend = function() {
                $.ajax({
                    url: host + "/merchant/" + shop_id + "/msgconfig",
                    async: false,
                    type: "GET"
                }).success(function(data) {
                    $("#hidden_div").removeClass("hidden");
                    $scope.msgconfig = data;
                    $scope.disable = true;
                    if ($scope.msgconfig.mass_remain_count > 0) {
                        if ($scope.page.total_num > 0) {} else {
                            $scope.disable = false;
                        }
                    }
                    $scope.ckcontent_holder = "本月粉丝群发消息已发送" + String($scope.msgconfig.current_mass_count - $scope.msgconfig.mass_remain_count) + "条, 还可以发送" + String($scope.msgconfig.mass_remain_count) + "条";
                });
            };
            $scope.isAvailableSend();


            var popInfo = function() {
                $scope.shop_id = shop_id;
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/merchant/account/fans/info.html',
                    controller: ['$scope', '$modalInstance', '$http', 'shop_id', function($scope, $modalInstance, $http, shop_id) {
                        $scope._confirm = function() {
                            $modalInstance.close();
                        };
                    }],
                    resolve: {
                        shop_id: function() {
                            return $scope.shop_id;
                        }
                    },
                    size: 'sm',
                    windowClass: 'pub-window',
                    backdropClass: 'modal-backdrop'
                });
                modalInstance.result.then(function() {});
            };

            $scope.send = function() {
                if (hascookie.check('mt')) {
                    var params_str = "";
                    var ids = "";
                    for (var i = 0; i < $scope.allfans.length; i++) {
                        params_str += "uid=" + String($scope.allfans[i].user_id) + "&"
                        ids += String($scope.allfans[i].user_id) + ",";
                    }
                    var url = msghost + "/chat/" + String(shop_id) + "/fans/message/?" + params_str;
                    $http({
                        url: url,
                        method: "POST",
                        data: $scope.ckcontent
                    }).success(function(data) {
                        $scope.isAvailableSend();
                        popInfo();
                        $scope.content = '';
                    });

                    $http({
                        url: host + "/shop/" + shop_id + "/fansmessage",
                        data: {
                            "sendall": true,
                            "userids": ids,
                            "message": $scope.ckcontent
                        },
                        method: "POST"
                    }).success(function(data) {})
                }
            };
            $scope.isAvailableSend();
        }
    ])

});
