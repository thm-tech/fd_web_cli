"use strict";define(["angular","app","md5","services/Base64","services/rememberMe"],function(a,b){b.factory("authorization",["$rootScope","$http","Base64","remember",function(a,b,c,d){var e={};return e.login=function(a,c){return c.password=hex_md5(c.password),e._credentials=c,b({url:a,method:"POST",withCredentials:!0,data:e._credentials})},e.setCredentials=function(b,e){c.encode(b.username+":"+b.password);b.password=hex_md5(b.password),a.globals={value:b,expires:e,path:"",secure:""},console.log("globals,"+a.globals),d.put("globals",a.globals)},e.clearCredentials=function(){a.globals={},d.remove("globals")},e}])});