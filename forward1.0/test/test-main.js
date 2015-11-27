var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    // Removed "Spec" naming from files
    if (/Spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/app/scripts',

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
        'angular-route': ['angular'],
        'angular-cookies': ['angular'],
        'angular-sanitize': ['angular'],
        'angular-resource': ['angular'],
        'angular-animate': ['angular'],
        'angular-touch': ['angular'],
        'angular-mocks': {
          deps:['angular'],
          'exports':'angular.mock'
        }
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
