define(["angular","app","md5","services/authorization"],function(a,b){b.controller("serverinfo",["$scope","$rootScope","authorization","$http","$modal","FileUploader",function(a,b,c,d,e,f){var g=b.globals.shop_id,h=b.proxyUrl;d({url:h+"/merchant/"+g+"/serviceinfo",method:"GET"}).success(function(b){1==b.service_status?a.service_status="等待审核":2==b.service_status?a.service_status="正常使用":3==b.service_status?a.service_status="欠费停用":4==b.service_status&&(a.service_status="审核未通过"),a.service_deadline=b.service_deadline?b.service_deadline.substr(0,19):"无"})}])});