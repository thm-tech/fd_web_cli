"use strict";define(["angular","app","md5"],function(a,b){b.controller("cmregisterCtrl",["$scope","$rootScope","$http","$location","$interval",function(a,b,c,d,e){var f=a.user={},g=b.proxyUrl,h=g+"/user/gencode",i=g+"/user/register";f.clicked=!1,f.codeErr=!1,f.sCount=60,f.mphone="",f.reSend="重新发送("+f.sCount+")",a.$watch("user.sCount",function(a){f.reSend="重新发送("+f.sCount+")"}),f.getCode=function(){f.errPho||(f.clicked=!0,e(function(){f.sCount>1?--f.sCount:(f.clicked=!1,f.sCount=60)},1e3,60),c({url:h,method:"post",data:{phone:f.mphone}}).success(function(a){}).error())};var j=a._alert={};a.regSucceed=!0;var k="此手机号已被注册",l="注册失败",m={type:"danger"};j.alerts=[],j.alerts.push(m),j.closeAlert=function(a){j.alerts.splice(a,1)},f.register=function(){c({url:i,method:"POST",data:{phone:f.mphone,password:hex_md5(f.password)}}).success(function(b){0==b.err?d.path("/customer/login"):131075==b.err?(a.regSucceed=!1,m.msg=k):(a.regSucceed=!1,m.msg=l),0==j.alerts.length&&j.alerts.push(m)}).error()};var n="请输入您的手机号",o="请输入正确的手机号";f.errPho=!1,f.analysePho=function(){f.mphone?11!=f.mphone.length?(console.log("no 11"),f.errPho=!0,f.errPhoMsg=o):/^1[3|4|5|7|8][0-9]\d{4,8}$/.test(f.mphone)||(console.log("err 11"),f.errPho=!0,f.errPhoMsg=o):(console.log("empty"),f.errPho=!0,f.errPhoMsg=n),console.log("analyse")},f.rmMsg=function(){f.errPho=!1}}])});