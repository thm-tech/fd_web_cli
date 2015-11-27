/*jshint unused: vars */
define(['angular','angularUiRouter','angularSanitize','angularBootstrap','jquery','uievent','angularuimapbaidu','ngckeditor','fileupload','emoji','angularQrcode','angularLocal']/*deps*/,
        function (angular)/*invoke*/ {
  'use strict';

  /**
   * @ngdoc overview
   * @name forwardApp
   * @description
   * # forwardApp
   *
   * Main module of the application.
   */
  var app = angular.module('forwardApp', [
    'ui.router',
    'ngSanitize',
    'ui.bootstrap',
    'ui.event',
    'ui.map',
    'ngCkeditor',
    'angularFileUpload',
    'emoji',
    'monospaced.qrcode',
    'ngLocale'
//    'ngRoute'
  ]);
   
   app.run(['$rootScope','$state','$stateParams','$http',
      function($rootScope,$state,$stateParams,$http){
        $rootScope.$state = $state;
        $rootScope.stateParams = $stateParams;
        /*
        $http.get('webconfig.json')
        .success(function(data) {
            $rootScope.hostname = data.hostname;
            $rootScope.proxyUrl = data.webURL;
            $rootScope._proxyUrl = data._webURL;
            $rootScope.chatProxyUrl = data.chatURL;
            $rootScope._chatProxyUrl = data._chatURL;
            $rootScope.serviceTEL = data.serviceTEL;
        });*/
        $.ajax({
            url:'webconfig.json',
            async:false,
            success:function(data) {
                console.log(data);
                $rootScope.hostname = data.hostname;
                $rootScope.proxyUrl = data.webURL;
                $rootScope._proxyUrl = data._webURL;
                $rootScope.chatProxyUrl = data.chatURL;
                $rootScope._chatProxyUrl = data._chatURL;
                $rootScope.serviceTEL = data.serviceTEL; 
            }
        })
      }]);
    app.config(['$controllerProvider','$compileProvider',
        '$filterProvider','$provide','$httpProvider','uiMapLoadParamsProvider',
        function($controllerProvider,$compileProvider,$filterProvider,$provide,$httpProvider,uiMapLoadParamsProvider){
                app.controller = $controllerProvider.register;
                app.directive = $compileProvider.directive;
                app.filter = $filterProvider.register;
                app.factory = $provide.factory;
                app.service = $provide.service;
                $httpProvider.defaults.withCredentials = true;
                uiMapLoadParamsProvider.setParams({
                    v:'1.5',
                    ak:'Gh3CUkGGR24DReFcB2xsL1Gb'
                });
            }            
        ]);
    return app;
});
