function changeDateToString(DateIn) {

    if (typeof DateIn == "string") {
        return DateIn
    }

    var Year = 0;
    var Month = 0;
    var Day = 0;
    var CurrentDate = "";

    Year = DateIn.getFullYear();
    Month = DateIn.getMonth() + 1;
    Day = DateIn.getDate();

    CurrentDate = Year + "-";
    if (Month >= 10) {
        CurrentDate = CurrentDate + Month + "-";
    } else {
        CurrentDate = CurrentDate + "0" + Month + "-";
    }
    if (Day >= 10) {
        CurrentDate = CurrentDate + Day;
    } else {
        CurrentDate = CurrentDate + "0" + Day;
    }
    return CurrentDate;
}

define(['angular', 'app', 'services/checkcookie'], function(angular, app) {
    app.controller('historyActivity', ['$scope', '$http', '$rootScope', '$modal', 'hascookie',
        function($scope, $http, $rootScope, $modal, hascookie) {
            document.title = "活动 -喵喵熊";
            var shop_id = $scope.shop_id = $rootScope.globals.shop_id;
            var host = $rootScope.proxyUrl;
            var msghost = $rootScope.chatProxyUrl;

            var date = new Date()

            var getdate = $scope.getdate = function(strDate) {
                var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
                    function(a) {
                        return parseInt(a, 10) - 1;
                    }).match(/\d+/g) + ')');
                return date;
            }
            $scope.now = new Date();

            $scope.show = {};
            $scope.show.should_i_show = 1;
            $scope.drop_down = function(activity) {
                $scope.$broadcast("drop_down", activity);
                $scope.show.should_i_show = 2;
            };

            $scope.$on('drop_up', function(event, msg) {
                $scope.show.should_i_show = 1;
            });

            $scope.delect = function(act_id) {
                popDialog(act_id);
            };

            $scope.page = {};
            $scope.page.page_num = 999999;
            $scope.init = function(pagenum) {
                if (pagenum <= 0 || (pagenum > $scope.page.page_num && pagenum != 1)) {
                    return false
                }

                if (pagenum == 0 || (pagenum - 1 == $scope.page.page_num && pagenum != 1)) {
                    return false
                }
                $scope.page.current_page = pagenum;
                $http({
                    url: host + "/shop/" + shop_id + "/activities" + "?offset=" + String(10 * (pagenum - 1)) + "&limit=10",
                    method: 'GET'
                }).success(function(data) {
                    if (data.is_success) {
                        $scope.activities = data.activities;
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
                    console.log($scope.page)
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

            var popDialog = function(act_id) {
                $scope.shop_id = shop_id;
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/merchant/account/activity/confirm.html',
                    controller: ['$scope', '$modalInstance', '$http', 'shop_id', function($scope, $modalInstance, $http, shop_id) {
                        $scope.notice = true;
                        $scope.shop_id = shop_id;
                        $scope._confirm = function() {
                            $modalInstance.close();
                        };
                        $scope._cancel = function() {
                            $modalInstance.dismiss('cancel');
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
                modalInstance.result.then(function() {
                    $http({
                        url: host + "/shop/" + shop_id + "/activity/" + act_id,
                        method: 'DELETE'
                    }).success(function(data) {
                        if (data.is_success) {
                            $scope.show.should_i_show = 1;
                            $scope.init($scope.page.current_page);
                            $scope.$broadcast("delect", null);
                        } else {
                            popInfo();
                            //console.log(data.error_code);
                            //if(data.error_code == 196627){
                            //    console.log('活动未结束, 您无法删除')
                            //}
                        }
                    });
                });
            };

            var popInfo = function() {
                $scope.shop_id = shop_id;
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/merchant/account/activity/info.html',
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
        }
    ]);


    app.controller('activityInfo', ['$scope', '$http', '$rootScope', '$sce',
        function($scope, $http, $rootScope, $sce) {
            var shop_id = $rootScope.globals.shop_id;
            var host = $rootScope.proxyUrl;

            //$scope.show.should_i_show = 2;

            $scope.$on('drop_down', function(event, msg) {
                $scope.activity = msg;
                $scope.show.should_i_show = 2;

                var conts = $scope.conts = JSON.parse(msg.act_content);
                console.log(conts)

                // width adaptive begin
                // m_info_width = $(".m_table").width() - 42;
                // var html = $scope.activity.act_content;
                // var re = new RegExp("height:(.*?)px; width:(.*?)px", ["g"]);
                // while (res = re.exec(html)) {
                //     if (res[2] > m_info_width) {
                //         var nw = m_info_width;
                //         var nh = res[1] * m_info_width / res[2];
                //         html = html.replace(res[0], "height:" + String(nh) + "px; width:" + String(nw) + "px")
                //     }
                // }
                // $scope.activity_html = $sce.trustAsHtml(html);
                // end
            });

            $scope.$on('delect', function(event, msg) {
                $scope.show.should_i_show = 1;
            });

            $scope.drop_up = function() {
                $scope.show.should_i_show = 1;
                $scope.$emit('drop_up', null)
            }

        }
    ]);


    app.controller('postActivity', ['$scope', '$http', '$rootScope', '$stateParams', '$modal', 'hascookie', 'FileUploader',
        function($scope, $http, $rootScope, $stateParams, $modal, hascookie, FileUploader) {
            var shop_id = $rootScope.globals.shop_id;
            var host = $rootScope.proxyUrl;
            var msghost = $rootScope.chatProxyUrl;


            $scope.begin_date = changeDateToString(new Date());
            $scope.end_date = $scope.begin_date;
            $scope.minDate = $scope.minDate ? null : new Date();

            $scope.conts = {
                "index": 0,
                "sections": [
                    [1, ""],
                ]
            }

            $scope.sectionModelList = []

            $scope.newTextSection = function() {
                $scope.conts["index"] += 1;
                $scope.conts["sections"].push([1, ""]);
            }

            $scope.openUploadDialog = function() {
                $("#id_upload").trigger("click");
            };

            $scope.newImgSection = function(url) {
                $scope.conts["index"] += 1;
                $scope.conts["sections"].push([2, url]);
            };

            $scope.removeSection = function(index) {
                $scope.conts["index"] -= 1;
                $scope.conts["sections"].splice(index, index);
            }

            $scope.return_to_list = function() {
                $scope.show.should_i_show = 1;
            };

            $scope.begin_open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.begin_opened = true;
            };
            $scope.end_open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.end_opened = true;
                console.log($scope.begin_date, $scope.end_date)
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $http({
                url: host + "/shop/" + shop_id + "/fans" + "?offset=0&limit=10000000000000",
                method: 'GET'
            }).success(function(data) {
                if (data.is_success) {
                    $scope.allfans = data.fans;
                }
            });

            var popTips = function(isValid) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/merchant/account/activity/tips.html',
                    controller: ['$scope', '$modalInstance', '$http', function($scope, $modalInstance, $http) {

                        $scope.notice = true;
                        $scope.rest = true;
                        $scope.cb = true; //checkbox 可用
                        $scope.shop_id = shop_id;
                        $scope.postedNum = 0
                        $scope.restNum = 0



                        // get shopFansNum "$scope.fansNum"
                        $http({
                            url: host + '/shop/' + shop_id + '/fans?offset=0&limit=1',
                            method: 'GET'
                        }).success(function(data) {
                            $scope.fansNum = data.total_num;
                            console.log('fansNum,' + $scope.fansNum);
                        });
                        // "$scope.postedNum", "$scope.restNum"
                        var url = host + '/merchant/' + shop_id + '/msgconfig';
                        $http.get(url)
                            .success(function(data) {
                                $scope.restNum = data.mass_remain_count;
                                if ($scope.restNum <= 0 || $scope.fansNum == 0) {
                                    console.log('notice false');
                                    $scope.cb = false;
                                    $scope.rest = false;
                                    $scope.notice = false;
                                }
                                $scope.postedNum = data.current_mass_count - data.mass_remain_count;
                            })
                            .error(function(data) {

                            });

                        $scope._confirm = function() {
                            $modalInstance.close($scope.notice);
                        };
                        $scope._cancel = function() {
                            $modalInstance.dismiss();
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
                modalInstance.result.then(function(notice) {
                    $http({
                        url: host + "/shop/" + shop_id + "/activities",
                        data: {
                            'act_title': $scope.act_title,
                            'act_content': JSON.stringify($scope.conts),
                            'begin_time': changeDateToString($scope.begin_date),
                            'end_time': changeDateToString($scope.end_date)
                        },
                        method: 'POST'
                    }).success(function(data) {
                        if (data.is_success) {
                            $scope.show.should_i_show = 1;
                            $scope.init(1);
                            $scope.act_title = '';
                            $scope.act_content = '';
                            $scope.returnInfo = '';

                            if (notice) {
                                $scope.sendMsgToFanse = function() {
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
                                            data: {
                                                'act_title': $scope.act_title,
                                                'act_content': JSON.stringify($scope.conts),
                                                'begin_time': changeDateToString($scope.begin_date),
                                                'end_time': changeDateToString($scope.end_date)
                                            }
                                        }).success(function(data) {});

                                        $http({
                                            url: host + "/shop/" + shop_id + "/fansmessage",
                                            data: {
                                                "sendall": true,
                                                "userids": ids,
                                                "message": JSON.stringify({
                                                    'act_title': $scope.act_title,
                                                    'act_content': JSON.stringify($scope.conts),
                                                    'begin_time': changeDateToString($scope.begin_date),
                                                    'end_time': changeDateToString($scope.end_date)
                                                })
                                            },
                                            method: "POST"
                                        }).success(function(data) {})
                                    }
                                };
                                $scope.sendMsgToFanse()
                            }

                        } else {
                            $scope.returnInfo = '今天你已经发过活动了';
                            console.log(data, 'fail');
                        }
                    }).error(function() {
                        console.log('error')
                    });



                });

            };

            $scope.send = function(isValid) {
                if (hascookie.check('mt')) {
                    if (isValid) {
                        popTips();

                    } else {
                        alert('请填写所有活动信息')
                    }
                }
            };

            document.domain = $rootScope.hostname;
            $scope.editorOptions = {
                filebrowserImageUploadUrl: "http://" + $rootScope._chatProxyUrl + '/ck/file/uploader'
            };



            var uploader = $scope.uploader = new FileUploader({
                url: msghost + '/file/uploader',
                autoUpload: true
            });

            uploader.filters.push({
                name: 'imageFilter',
                fn: function(item, options) {
                    var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                    return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                }
            });

            uploader.onAfterAddingFile = function(fileItem) {};

            uploader._onSuccessItem = function(fileItem, resData, status, headers) {
                $scope.newImgSection(resData.url);
            };

            uploader.onCompleteAll = function() {};

        }
    ])
});
