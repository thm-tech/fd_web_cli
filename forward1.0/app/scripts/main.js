/*jshint unused: vars */
require.config({
  waitSeconds:0,
//  baseUrl:'../../bower_components/',
  paths: {
    angular:'//cdn.bootcss.com/angular.js/1.3.15/angular.min',//'../../bower_components/angular/angular.min',
    angularUiRouter:'//cdn.bootcss.com/angular-ui-router/0.2.13/angular-ui-router.min',//'../../bower_components/angular-ui-router/release/angular-ui-router.min',
    angularBootstrap:'//cdn.bootcss.com/angular-ui-bootstrap/0.12.1/ui-bootstrap-tpls.min',//'../../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
//    angularUiGrid:'../../bower_components/ng-grid/ng-grid-2.0.14.min',
//    angularRoute:'../../bower_components/angular-route/angular-route.min',
//    angularCookies:'../../bower_components/angular-cookies/angular-cookies.min',
    angularSanitize:'../../bower_components/angular-sanitize/angular-sanitize.min',
//    angularResource:'../../bower_components/angular-resource/angular-resource.min',
//    angularAnimate:'../../bower_components/angular-animate/angular-animate.min',
//    angularTouch:'../../bower_components/angular-touch/angular-touch.min',
//    angularMocks:'../../bower_components/angular-mocks/angular-mocks.min',
    jquery:'//cdn.bootcss.com/jquery/2.1.3/jquery.min',//'../../bower_components/jquery/dist/jquery.min',
    uievent:'../../bower_components/angular-ui-utils/event',
    angularuimapbaidu:'../../bower_components/angular-ui-map-baidu/ui-map',
    md5:'../../bower_components/md5/md5',
    ckeditor:'//cdn.bootcss.com/ckeditor/4.4.5/ckeditor',//'../../bower_components/ng-ckeditor/libs/ckeditor/ckeditor',
    ngckeditor:'../../bower_components/ng-ckeditor/ng-ckeditor.min',
    es5shim:'../../bower_components/es5-shim/es5-shim.min',
    es5sham:'../../bower_components/es5-shim/es5-sham.min',
    fileupload:'../../bower_components/angular-file-upload/angular-file-upload.min',
    emoji:'../../bower_components/angular-emoji-filter/dist/emoji.min',
    angularQrcode:'../../bower_components/angular-qrcode/qrcode',
    qrcode:'../../bower_components/qrcode-generator/js/qrcode',
    qrcodeUTF8:'../../bower_components/qrcode-generator/js/qrcode_UTF8',
    angularLocal:'../../bower_components/angular-local_zh-cn'
  },
  shim: {
    'angular' : {'exports' : 'angular'},
    
    'angularUiRouter':{
        deps:['angular'],
        exports:'angularUiRouter'},
    'angularBootstrap':{
        deps:['angular'],
        exports:'angularBootstrap'
        },
    'angularUiGrid':{
        deps:['angular','jquery'],
        exports:'angularUiGrid'
        },
//    'angularRoute': ['angular'],
    'angularCookies': ['angular'],
    'angularSanitize': ['angular'],
    'angularResource': ['angular'],
    'angularAnimate': ['angular'],
    'angularTouch': ['angular'],
    'angularMocks': {
      deps:['angular'],
      'exports':'angular.mock'
    },
    'uievent':{
        deps:['angular'],
        exports:'uievent'
    },
	'angularuimapbaidu': {
        deps:['angular','uievent'],
        exports:'angularuimapbaidu'
    },
    'md5':{'exports':'md5'},
    'rangy':{
        deps:['angular'],
        'exports':'rangy'
    },
    'taSanitize': ['angular'],
    'ckeditor': {'exports':'ckeditor'},
    'ngckeditor':{
        deps:['angular'],
        'exports':'ngckeditor'
    },
    'es5shim': {'exports':'es5shim'},
    'es5sham': {'exports':'es5sham'},
    'fileupload':{
        deps:['angular'],
        'exports':'fileupload'
    },
    'emoji':{
        deps:['angular'],
        'exports':'emoji'
    },
    'angularQrcode':{
        deps:['angular'],
        'exports':'angularQrcode'
    },
    'qrcode':{'exports':'qrcode'},
    'qrcodeUTF8':{'exports':'qrcodeUTF8'},
    'angularLocal':{'exports':'angularLocal'}
  },
  priority: [
    'angular'
  ]
});

//http://code.angularjs.org/1.2.1/docs/guide/bootstrap#overview_deferred-bootstrap
window.name = 'NG_DEFER_BOOTSTRAP!';

require([
  'angular',
  'app',
  'routes'
], function(angular,app,routes) {
  'use strict';
  /* jshint ignore:start */
  var $html = angular.element(document.getElementsByTagName('html')[0]);
  /* jshint ignore:end */
  angular.element().ready(function() {
    angular.resumeBootstrap([app.name]);
  });
});
