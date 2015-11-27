'use strict';

define(['angular','app','services/checkcookie'],function(angular,app) {
    app.controller('activityCtrl',['$scope','$rootScope','$http','$sce','hascookie',
        function($scope,$rootScope,$http,$sce,hascookie) {
            var PER_ACT_NUM = 9;
            var MAX_PAGE_NUM = 5;
            var act = $scope.act = {};
            var host = $rootScope.proxyUrl;
            var actUrl = host + '/user/activity';
            act.fromHome = false;//是否从首页
            act.a = {};
            act.a.b = 1;
            $scope.$on('intoAct',function(evt,msg) {
                $scope.$emit('recvAct');
                act.actStatus = {};
                if(msg.cid != undefined) {
                    document.title = '活动专区-喵喵熊';
                    act.cid = msg.cid;
                    act.actStatus.showList = true;
                    act.getAct(0);
                }
                else if(msg.activity != undefined){
                    act.fromHome = true;
                    act.showActDet(msg.activity);
                }
            });
            act.getAct = function(offset) {
                $http({
                    url:actUrl,
                    method:'GET',
                    params:{'city':act.cid,'offset':offset,'count':PER_ACT_NUM}
                })
                .success(function(data) {
                    if(data.err == 0) {
                        act.totalAct = data.count;
                        act.actList = data.actList;
                    }
                })
                .error();
            };
            act.showActDet = function(activity) {
                if(!hascookie.check('cm')) {
                    return;
                }
                document.title = activity.title + '-喵喵熊';
                var _activity = new Object();
                angular.copy(activity,_activity);
                console.log('this is activity in act');
                console.log(_activity);
                var maxWidth=740;
                var res;
                var re = new RegExp("height:(.*?)px; width:(.*?)px", ["g"]);              
                var html = _activity.content;
                
                while (res = re.exec(html)) {
                    if (res[2] > maxWidth) {
                        var nw = maxWidth;
                        var nh = res[1] * maxWidth / res[2];
                        html = html.replace(res[0], "height:" + String(nh) + "px; width:" + String(nw) + "px")
                    }
                }
                console.log('html,' + html);
//                console.log(activity);
                _activity.content = $sce.trustAsHtml(html);
                _activity.bt = _activity.bt.split(' ')[0];
                _activity.et = _activity.et.split(' ')[0];
                console.log('showactdet');
                act.actDet = _activity;
//                console.log(act.actDet);
                act.actStatus.showList = false;
            };
            act.curPage = 1;
            act.itemsPerPage = PER_ACT_NUM;
            act.maxSize = MAX_PAGE_NUM;
            act.selectPage = function(page) {
                console.log('pageNum,' + page);
                var _off = (page-1)*act.itemsPerPage;
                act.actList = [];
                act.getAct(_off);
            };
            act.intoShop = function(sid,sname) {
                if(!hascookie.check('cm')) {
                    return;
                }
                var sObj = {sid:sid,sname:sname};
                $scope.$emit('actToShop',sObj);
            };
            act.sendAct = function(id,name,imgUrl) {
                if(!hascookie.check('cm')) {
                    return;
                }
                var msg = {type:'act',id:id,name:name,img:imgUrl};
                $scope.$emit('_sendObjChannel',msg);
            };
            act.closeList = function() {
                $scope.$emit('closeActList');    
            };
            act.closeDet = function() {
                if(act.fromHome) {
                    $scope.$emit('closeActDet1');
                }
                else {
                    document.title = '活动专区-喵喵熊';
                    act.actStatus.showList = true;
                }
            };
        }    
    ]);
});
