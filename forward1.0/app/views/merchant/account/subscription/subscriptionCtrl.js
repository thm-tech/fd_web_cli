define(['angular', 'app', 'md5', 'services/authorization'], function (angular, app) {
    app.controller('payinfo', ['$scope', '$rootScope', 'authorization', '$http', '$modal', 'FileUploader',
        function ($scope, $rootScope, authorization, $http, $modal, FileUploader) {
            var shop_id = $rootScope.globals.shop_id;
            var host = $rootScope.proxyUrl;

            $http({
                url: host + "/merchant/" + shop_id + "/msgconfig",
                method: "GET"
            }).success(function (data) {
                $scope.msgconfig = data
            });

        }
    ]);
});