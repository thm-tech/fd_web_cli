define(["angular","app","md5","services/authorization","qrcode"],function(a,b){b.controller("index",["$http","$rootScope",function(a){var b=document.location.href,c=b.match("code=\\w+");if(c){var d=c[0].split("=")[1];a({url:$rootScope.proxyUrl+"/thirdlogin/wechat?code="+d,method:"GET"}).success(function(b){if(b=JSON.parse(b),b.errcode);else{var c=b.access_token,d=b.openid;a({url:$rootScope.proxyUrl+"/user/loginex",method:"POST",data:{mode:5,type:4,openID:d,dev:""}}).success(function(b){b.err||(console.log("third login success"),a({url:$rootScope.proxyUrl+"/thirdlogin/wechat/info?access_token="+c+"&openid="+d,method:"GET"}).success(function(b){b=JSON.parse(b),a({url:$rootScope.proxyUrl+"/user/personal",method:"POST",data:{attr:1,name:b.nickname}}).success(function(a){})}))})}})}}])});