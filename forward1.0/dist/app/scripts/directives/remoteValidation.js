"use strict";define(["angular","app"],function(a,b){b.directive("remoteValidation",["$rootScope","$http",function(a,b){var c=a.proxyUrl;return{restrict:"A",require:"ngModel",link:function(a,d,e,f){d.bind("blur",function(){b.get(c+"/merchant/isexist?account="+a.user.account).success(function(a,b,c,d){1==a.is_exist?f.$setValidity("remote",!1):f.$setValidity("remote",!0)})})}}}])});