'use strict';

define(['angular', 'app', 'services/authorization', 'services/rememberMe'], function (angular, app) {
    return app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
        var loadCtrl = {
            load: ['$q', '$rootScope', '$location',
                function ($q, $rootScope, $location) {
                    var url_param = ''; //url param
                    var CtrlPath = '';  //controller path
                    var loadCtrl = [];  //all ctrls need to load
                    var path = $location.path(); //current url
                    console.log('the path is ' + path);
                    var idx = path.indexOf('?');
                    var parsePath = (idx != -1) ? path.substring(0, idx).split('/') : path.split('/');
                    var routeDep = parsePath.length; // route depth
                    console.log('routeDep,' + routeDep + parsePath[0] + ',' + parsePath[1]);

                    if (parsePath[1] == 'index') {
                        loadCtrl.push('../views/platform/downloadCtrl');
                        CtrlPath = '../views/platform/platformCtrl';
                    }
                    else {
                        if (routeDep == 3) {
                            console.log('333333333333');
                            if (parsePath[2] == 'account') {
                                loadCtrl.push('../views/' + parsePath[1] + '/account/accountCtrl');
                                loadCtrl.push('../views/' + parsePath[1] + '/account/chatroom/chatroomCtrl');
                            }
                            CtrlPath = '../views/' + parsePath[1] + '/' + parsePath[2] + '/' + parsePath[2] + 'Ctrl';
                        }
                        else if (routeDep == 4) {
                            loadCtrl.push('../views/' + parsePath[1] + '/account/accountCtrl');
                            loadCtrl.push('../views/' + parsePath[1] + '/account/chatroom/chatroomCtrl');
                            CtrlPath = '../views/' + parsePath[1] + '/account/' + parsePath[3] + '/' + parsePath[3] + 'Ctrl';
                            console.log('CtrlPathhhhhhhhhhhhhhh,' + CtrlPath);
                        }

                    }
                    /*
                     else if(parsePath[1] == 'account') {
                     if (routeDep == 2) {
                     console.log('accountttttttttttttttttttttttttttttt');
                     loadCtrl.push('../views/account/accountCtrl');
                     CtrlPath = '../views/account/chatroom/chatroomCtrl';
                     }
                     else if(routeDep == 3){
                     loadCtrl.push('../views/account/accountCtrl');
                     loadCtrl.push('../views/account/chatroom/chatroomCtrl');
                     CtrlPath = '../views/account/' + parsePath[2] + '/' + parsePath[2] + 'Ctrl';
                     }
                     }*/
                    if (!CtrlPath) {
                        return;
                    }
                    else {
                        loadCtrl.push(CtrlPath);
                        console.log('the loadCtrl0 is,' + loadCtrl[0]);
                        var deferred = $q.defer();
                        require(loadCtrl, function () {
                            $rootScope.$apply(function () {
                                deferred.resolve();
                            });
                        });
                        return deferred.promise;
                    }
                }]
        };

        $urlRouterProvider.otherwise('/index');
        $urlRouterProvider.when('/customer/account', 'customer/account/shops');
        $stateProvider.state('index', {
            url: '/index',
            views: {
                '': {
                    templateUrl: '../views/platform/home.html',
                    resolve: loadCtrl
                },
                'main@index': {
                    templateUrl: '../views/platform/main.html'
                }
            },
            auth: true
        }).state('index.module', {
            url: '/:module',
            views: {
                'module@index': {
                    templateUrl: function (sp) {
                        if (!sp.module) {
                            return '../index.html';
                        }
                        return '../views/platform/' + sp.module + '.html';
                    }
                    //   resolve:loadCtrl
                }
            },
            auth: true

        }).state('cmlogin', {
            url: '/customer/login',
            templateUrl: '../views/customer/login/login.html',
            resolve: loadCtrl,
            auth: true
        }).state('mtlogin', {
            url: '/merchant/login',
            templateUrl: '../views/merchant/login/login.html',
            resolve: loadCtrl,
            auth: true
        }).state('cmreset', {
            url: '/customer/resetPsw',
            templateUrl: '../views/customer/resetPsw/resetPsw.html',
            resolve: loadCtrl,
            auth: true
        }).state('mtreset', {
            url: '/merchant/resetPsw',
            templateUrl: '../views/merchant/resetPsw/resetPsw.html',
            resolve: loadCtrl,
            auth: true
        }).state('cmregister', {
            url: '/customer/cmregister',
            templateUrl: '../views/customer/cmregister/cmregister.html',
            resolve: loadCtrl,
            auth: true
        }).state('cmaccount', {
            url: '/customer/account',
            views: {
                '': {
                    templateUrl: '../views/customer/account/account.html'
                },
                'chat@cmaccount': {
                    templateUrl: '../views/customer/account/chatroom/chatroom.html',
                    resolve: loadCtrl
                }
            },
            auth: false
        }).state('cmaccount.module', {
            url: '/:module?city&w&page',
            views: {
                'function@cmaccount': {
                    templateUrl: function (sp) {
                        console.log('sp.module,' + sp.module);
                        var idx = sp.module.indexOf('?');
                        var mod = (idx != -1) ? sp.module.substring(0, idx) : sp.module;
                        return '../views/customer/account/' + mod + '/' + mod + '.html';
                    },
                    resolve: loadCtrl
                }
            },
            auth: false
        }).state('mtaccount', {
            url: '/merchant/account',
            views: {
                '': {
                    templateUrl: '../views/merchant/account/account.html'
                },
                'chat@mtaccount': {
                    templateUrl: '../views/merchant/account/chatroom/chatroom.html',
                    resolve: loadCtrl
                },
                'noservice@mtaccount': {
                    templateUrl: '../views/merchant/account/noservice/noservice.html'
                }
            },
            auth: false
        }).state('mtaccount.module', {
            url: '/:module',
            views: {
                'function@mtaccount': {
                    templateUrl: function (sp) {
                        return '../views/merchant/account/' + sp.module + '/' + sp.module + '.html';
                    },
                    resolve: loadCtrl
                }
            },
            auth: false
        }).state('mtaccount.module.submodule', {
            url: '/:submodule',
            views: {
                'submodule': {
                    templateUrl: function (sp) {
                        console.log('type,' + typeof sp.submodule);
                        return '../views/merchant/account/' + sp.module + '/' + sp.submodule + '/' + sp.submodule + '.html';
                    },
                    resolve: loadCtrl
                }
            },
            auth: false
        }).state('404', {
            url: '/404',
            templateUrl: '../404.html',
            auth: true
        });

//                $locationProvider.html5Mode(true);
        // $locationProvider.hashPrefix('!');

    }]).run(['$rootScope', '$state', '$location', '$http','remember', '$timeout', '$q', 'authorization',
        function ($rootScope, $state, $location, $http, remember, $timeout, $q, authorization) {
            var host = $rootScope.proxyUrl;
            $rootScope.globals = remember.get('globals') || {};
            console.log('now is,' + $rootScope.globals.username);

            /*
             if ($rootScope.globals.currentUser) {
             $http.defaults.headers.common.Authorzition = 'Basic' + $rootScope.globals.currentUser.authData;
             }*/

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

                    var URL = document.location.href;
                    var match = URL.match('code=\\w+');

                    // qq login
                    var matchname = URL.match('name=[^&]+');
                    if (matchname) {
                        var name = matchname[0].split('=')[1];
                        name = decodeURIComponent(name);
                        var matchgender = URL.match('gender=\\d+');
                        var gender = matchgender[0].split('=')[1];
                        var portraitUrlMatcher = URL.match('portraitUrl=[^&]+');
                        var portraitUrl = portraitUrlMatcher[0].split('=')[1];

                        var accessTokenMatch = URL.match('access_token=\\w+');
                        var access_token = accessTokenMatch[0].split('=')[1];

                        var openidMatch = URL.match('openid=\\w+');
                        var openid = openidMatch[0].split('=')[1];

                        $http({
                            url: host + "/user/loginex",
                            method: "POST",
                            data: {
                                mode: 5,
                                type: 4,
                                openID: openid,
                                dev: ""
                            }
                        }).success(function (data) {
                            var is_reg = data.isReg;
                            var accid = data.accID;
                            console.log('third login result data', data);
                            if (!data.err) {
                                console.log('third login success');

                                if (is_reg) {

                                    $http({
                                        url: host + "/user/personal",
                                        method: "POST",
                                        data: {
                                            attr: 1,
                                            name: name
                                        }
                                    }).success(function (data) {
                                        console.log('modify user name in immbear result', data);
                                    });

                                    $http({
                                        url: host + "/user/personal",
                                        method: "POST",
                                        data: {
                                            attr: 3,
                                            gender: gender
                                        }
                                    }).success(function (data) {
                                        console.log('modify user name in immbear result', data);
                                    });

                                    $http({
                                        url: host + "/userweb/quickmodifyimg",
                                        method: "PUT",
                                        data: {
                                            user_id: accid,
                                            url: portraitUrl
                                        }
                                    }).success(function (data) {
                                        console.log('modify user imgurl success', data);


                                        // Set Cookie
                                        var cookieData = {
                                            userID: accid,
                                            accType: 'cm',
                                            username: name,
                                            password: openid,
                                            portrait: data.url
                                        };
                                        authorization.setCredentials(cookieData, 30);
                                        $rootScope.globals = remember.get('globals') || {};
                                        $location.path('/customer/account');
                                        // Set Cookie End


                                    });


                                    console.log('------------------------------END');

                                }
                                else {
                                    $http({
                                        url: host + "/user/personal",
                                        method: "GET"
                                    }).success(function (data) {
                                        var accInfo = data;
                                        var cookieData = {
                                            userID: accid,
                                            accType: 'cm',
                                            username: accInfo.info.name,
                                            password: openid,
                                            portrait: accInfo.info.portrait
                                        };
                                        authorization.setCredentials(cookieData, 30);
                                        $rootScope.globals = remember.get('globals') || {};
                                        $location.path('/customer/account');
                                    });
                                }

                            } else {
                                // third login failed
                            }
                        })
                    }


                    else if (match) {
                        var code = match[0].split('=')[1];

                        $http({
                            url: host + "/thirdlogin/wechat?code=" + code,
                            method: "GET"
                        }).success(function (data) {
                            if (data.errcode) {
                                console.log('errcode', data)
                            } else {
                                var access_token = data.access_token;
                                var open_id = data.openid;
                                console.log('access_token', access_token);
                                console.log('open_id', open_id);
                                $http({
                                    url: host + "/user/loginex",
                                    method: "POST",
                                    data: {
                                        mode: 5,
                                        type: 4,
                                        openID: open_id,
                                        dev: ""
                                    }
                                }).success(function (data) {
                                    var is_reg = data.isReg;
                                    var accid = data.accID;
                                    console.log('third login result data', data);
                                    if (!data.err) {
                                        console.log('third login success');

                                        $http({
                                            url: host + "/thirdlogin/wechat/info?access_token=" + access_token + "&openid=" + open_id,
                                            method: "GET"
                                        }).success(function (data) {
                                            var user_info_from_wechat = data;
                                            console.log('get wechat info success', data);
                                            if (is_reg) {
                                                // Set Cookie
                                                var cookieData = {
                                                    userID: accid,
                                                    accType: 'cm',
                                                    username: user_info_from_wechat.nickname,
                                                    password: open_id,
                                                    portrait: user_info_from_wechat.headimgurl
                                                };
                                                authorization.setCredentials(cookieData, 30);
                                                $rootScope.globals = remember.get('globals') || {};
                                                console.log('--------------------------------');
                                                console.log(accid, user_info_from_wechat);
                                                console.log('--------------------------------');
                                                $location.path('/customer/account');
                                                // Set Cookie End
                                                $http({
                                                    url: host + "/user/personal",
                                                    method: "POST",
                                                    data: {
                                                        attr: 1,
                                                        name: data.nickname
                                                    }
                                                }).success(function (data) {
                                                    console.log('modify user name in immbear result', data);
                                                });

                                                $http({
                                                    url: host + "/user/personal",
                                                    method: "POST",
                                                    data: {
                                                        attr: 3,
                                                        gender: data.sex
                                                    }
                                                }).success(function (data) {
                                                    console.log('modify user name in immbear result', data);
                                                });

                                                $http({
                                                    url: host + "/userweb/quickmodifyimg",
                                                    method: "PUT",
                                                    data: {
                                                        user_id: accid,
                                                        url: user_info_from_wechat.headimgurl
                                                    }
                                                }).success(function (data) {
                                                    console.log('modify user imgurl success', data);
                                                });
                                                console.log('------------------------------END');

                                            }
                                            else {
                                                $http({
                                                    url: host + "/user/personal",
                                                    method: "GET"
                                                }).success(function (data) {
                                                    var accInfo = data;
                                                    var cookieData = {
                                                        userID: accid,
                                                        accType: 'cm',
                                                        username: accInfo.info.name,
                                                        password: open_id,
                                                        portrait: accInfo.info.portrait
                                                    };
                                                    authorization.setCredentials(cookieData, 30);
                                                    $rootScope.globals = remember.get('globals') || {};
                                                    $location.path('/customer/account');
                                                });
                                            }
                                        });

                                    } else {
                                        // third login failed
                                    }
                                });
                            }
                        });
                    }

                    else if (!toState.auth && !remember.get('globals')) {
                        console.log('loginnnnnnnnn');
                        console.log(toState);
                        console.log(toParams);
                        console.log($location.path());
                        event.preventDefault();
                        var deferred = $q.defer();
                        var loginCtrl = ['../views/customer/login/loginCtrl'];
                        require(loginCtrl, function () {
                            $rootScope.$apply(function () {
                                deferred.resolve();
                            });
                        });
                        deferred.promise.then(function (res) {
                            $state.go('cmlogin');
                        });
                    }
                    else if(!toState.auth && remember.get('globals')){
                    		var toPath = $location.path().split('/')[1];  //??ȡ?????̼Һ??û?url?ؼ???
                    		if(remember.get('globals').accType == 'cm' && toPath == 'merchant') {
                    				authorization.clearCredentials();
                    				$http({
                    						url: host + '/user/logout',
                    						method: 'POST',
                    						data: {}	
                    				})
                    				.success(function(data) {
                    					
                    				})
                    				.error(function() {});
                    				$location.path('/merchant/login');
                    					
                    		}
                    		else if (remember.get('globals').accType == 'mt' && toPath == 'customer'){
	                    			authorization.clearCredentials();
	                    			$http({
	                    						url: host + '/merchant/logout',
	                    						method: 'POST',
	                    						data: {}	
	                    				})
	                    				.success(function(data) {
	                    					
	                    				})
	                    				.error(function() {});
	                    				$location.path('/customer/login');
                    		}
                    }
                }
            );

            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if (toState.auth && remember.get('globals')) {
                    console.log('herehere');
                    $rootScope.globals = remember.get('globals');
                    var accType = remember.get('globals').accType;
                    var curPath = $location.path();
                    var pathArr = curPath.split('/');
                    var pathLen = pathArr.length;
                    if (pathLen == 2 || pathArr[2] === 'login') {
                        console.log('22222222222');
                        if (accType == 'cm') {
                            $location.path('/customer/account');
                        }
                        else if (accType == 'mt') {
                            $location.path('/merchant/account');
                        }
                    }
                }
            });
        }
    ])
        ;
});
