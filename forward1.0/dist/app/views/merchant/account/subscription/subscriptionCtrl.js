define(["angular","app","md5","services/authorization"],function(a,b){b.controller("payinfo",["$scope","$rootScope","authorization","$http","$modal","FileUploader",function(a,b,c,d,e,f){var g=b.globals.shop_id,h=b.proxyUrl;d({url:h+"/merchant/"+g+"/msgconfig",method:"GET"}).success(function(b){a.msgconfig=b})}])});