define(['angular', 'app', 'md5', 'services/authorization'], function (angular, app) {
    app.controller('serverinfo', ['$scope', '$rootScope', 'authorization', '$http', '$modal', 'FileUploader',
        function ($scope, $rootScope, authorization, $http, $modal, FileUploader) {
            var shop_id = $rootScope.globals.shop_id;
            var host = $rootScope.proxyUrl;

            $http({
                url: host + "/merchant/" + shop_id + "/serviceinfo",
                method: "GET"
            }).success(function (data) {
                if (data.service_status == 1) {
                    $scope.service_status = '等待审核'
                } else if (data.service_status == 2) {
                    $scope.service_status = '正常使用'
                } else if (data.service_status == 3) {
                    $scope.service_status = '欠费停用'
                } else if (data.service_status == 4) {
                    $scope.service_status = '审核未通过'
                }
                if (data.service_deadline) {
                    $scope.service_deadline = data.service_deadline.substr(0, 19)
                } else {
                    $scope.service_deadline = '无'
                }
            })

        }
    ])
});