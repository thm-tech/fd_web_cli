"use strict";define(["angular","app"],function(a,b){b.directive("checkCaptcha",["$rootScope","$http",function(a,b){var c=a.proxyUrl;return{restrict:"A",require:"ngModel",link:function(a,d,e,f){d.bind("blur",function(){if(null!=a.telephone_no){{({code:a.captcha})}b.post(c+"/basic/phonevalidate/"+a.telephone_no,{code:a.captcha}).success(function(a,b,c,d){0==a.is_success?f.$setValidity("captchaa",!1):f.$setValidity("captchaa",!0)})}else f.$setValidity("captchaa",!1)})}}}])});