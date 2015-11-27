'use strict';

define(['angular','app','md5','services/Base64','services/rememberMe'], function(angular,app) {
    app.factory('authorization',['$rootScope','$http','Base64','remember',function($rootScope,$http,Base64,remember) {
        var auth = {};
//        auth._credentials = {account: '离愁'};
        //登录动作
        auth.login = function(loginUrl,credentials) {
                        credentials.password = hex_md5(credentials.password);
                        auth._credentials = credentials;
                        return $http({
                                    url:loginUrl,
                                    method:'POST',
                                    /*
                                    headers: {
                                        'Content-Type':'application/x-www-form-urlencoded'
                                    },*/
                                    withCredentials:true,
                                    data: auth._credentials
                                });
                    };
        //设置前端cookie
        auth.setCredentials = function(cookieData,expires) {
                var authData = Base64.encode(cookieData.username + ':' + cookieData.password);
                cookieData.password = hex_md5(cookieData.password);
                $rootScope.globals = {
                    value: cookieData,
                    expires:expires,
                    path:'',
                    secure:''
                };
//                $rootScope.globals = angular.toJson($rootScope.globals);
                console.log('globals,' + $rootScope.globals);
//                $http.defaults.headers.common.Authorzition = 'Basic' + authData;
                remember.put('globals',$rootScope.globals);
//                remember.put('test',test);
        };
        //清除前端cookie
        auth.clearCredentials = function() {
                $rootScope.globals = {};
                remember.remove('globals');
//                $http.defaults.headers.common.Authorzition = 'Basic';
        };
        return auth;
    }]);    
});
