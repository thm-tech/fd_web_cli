Array.prototype.remove=function(a){var b=this.indexOf(a);b>-1&&this.splice(b,1)},define(["angular","app"],function(a,b){b.controller("FavCtrl",["$scope","$rootScope","$http","$window",function(a,b,c,d){var e=b.proxyUrl,f=(b.globals.userID,a.user={});f.allfavData=[];var g={shopIDs:[]},h=a.len,i=function(b){c.post(e+"/user/fans/diff",g).success(function(d){f.favshopidlist=a.user.favshopidlist=d.addShopIDs,h=f.favshopidlist.length;var g=Math.ceil(h/12);if(g>=b){for(var i=[],j=12*(b-1);12*b>j;j++)i[j]="sid="+f.favshopidlist[j]+"&";for(var j=0;12>j;j++)i.remove("sid=undefined&");var k=e+"/user/fans/info?"+i.join(""),l=k.substring(0,k.length-1),m=e+"/user/fans/news?"+i.join(""),n=m.substring(0,m.length-1);c({url:l,method:"GET"}).success(function(b){f.allfavData=f.allfavData.concat(b.shopList),a.favlist=f.allfavData,a.toggle1=function(b,d){a.favlist[b].ifshow=a.favlist[b].ifshow?!1:!0,c["delete"](e+"/user/shop/concern?sid="+d).success(function(a){})},a.toggle2=function(b,d){a.favlist[b].ifshow=a.favlist[b].ifshow?!1:!0,c.post(e+"/user/shop/concern?sid="+d).success(function(a){})}}),c({url:n,method:"GET"}).success(function(b){for(var c=0;c<b.shopList.length;c++)a.favlist[c].hasNew=1==b.shopList[c].hasNew?!0:!1})}})};i(1);var j=20,k=200,l=1,m=0;d.onscroll=function(){var a=$(window).scrollTop(),b=$(document).height(),c=$(window).height();m=parseFloat(c)+parseFloat(a),m>=b-k&&0!=f.allfavData.length&&l!=j&&(i(l+1),l++)}}])});