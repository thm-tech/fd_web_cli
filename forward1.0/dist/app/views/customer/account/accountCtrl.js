"use strict";define(["angular","app","services/authorization","services/ucmsgdata","directives/scrollonclick","services/rememberMe"],function(a,b){b.controller("cmaccountCtrl",["$scope","$rootScope","$http","$location","$window","$interval","authorization","ucmsgdata","remember",function(a,b,c,d,e,f,g,h,i){console.log(b.globals);var j=a.accountInfo={},k=b.proxyUrl;if(j.accountName=b.globals.username||"",j.portraitUrl=b.globals.portrait||"",a.loadChat=!1,b.globals.username&&b.globals.portrait)a.loadChat=!0,j.accountName=b.globals.username,j.portraitUrl=b.globals.portrait;else var l=f(function(){console.log("gettttttttttttttt"),b.globals.username&&b.globals.portrait&&(a.loadChat=!0,f.cancel(l)),j.accountName=b.globals.username,j.portraitUrl=b.globals.portrait},100,15);a.needChat=!0,a.curNav="",a.curHomeUrl="#/customer/account/shops",j.newMsg={read:!1};var m=d.path().split("/")[3],n=function(){"settings"==m||"feedback"==m?(a.needChat=!1,a.curNav=""):(a.needChat=!0,a.curNav=m)};a.modNav=function(b){"settings"==b||"feedback"==b?(a.needChat=!1,a.curNav=""):(a.needChat=!0,a.curNav=b),"message"==b&&(a.$broadcast("reloadMsg"),j.newMsg.read=!1)},a.logout=function(){document.title="喵喵熊 妙生活",g.clearCredentials(),c({url:k+"/user/logout",method:"POST",data:{}}).success(function(a){}).error(function(a){}),d.path("/index"),a.$broadcast("logout")};var o=function(b,c){a.$broadcast(b,c)};a.$on("changeHome",function(b,c){console.log("home id "+c),a.curHomeUrl="#/customer/account/shops?city="+c}),a.$on("changeHead",function(a,b){j.portraitUrl=b,o("_changeHead",b)}),a.$on("changeName",function(a,b){j.accountName=b,o("_changeName",b)}),a.$on("UcMsgChannel",function(b,c){console.log("onnnnnnnnnnnnnn"),console.log(c),j.newMsg.read=!0,a.$digest(),h.setData(c)}),a.$on("_sendObjChannel",function(a,b){console.log("objjjj"),console.log(b),o("sendObjChannel",b)}),a.$on("_chatToOwnerChannel",function(a,b){console.log("chat to owner"),console.log(b),o("chatToOwnerChannel",b)}),a.$on("_enterShopChannel",function(a,b){console.log("enter,"+b),console.log(b),o("enterShopChannel",b)}),a.$on("recvObjChannel",function(a,b){o("_recvObjChannel",b)}),e.onscroll=function(){var b=$(window).scrollTop(),c=$(document).height(),d=$(window).height(),e=parseInt(d+b);a.$apply(function(){a.showTop=b>=300?!0:!1});var f={totalHeight:e,docHeight:c,scrollPos:b};o("scroll",f)},n()}])});