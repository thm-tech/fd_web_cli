define(["angular","app","services/checkcookie"],function(a,b){b.controller("fanslist",["$scope","$http","$rootScope","hascookie",function(a,b,c,d){document.title="粉丝 -喵喵熊";var e=c.globals.shop_id,f=c.proxyUrl;a.show={},a.show.should_i_show=1,a.drop_down=function(b){a.$broadcast("drop_down",b),a.show.should_i_show=2},a.$on("drop_up",function(b,c){a.show.should_i_show=1}),b({url:f+"/shop/"+e+"/fans?offset=0&limit=10000000000000",method:"GET"}).success(function(b){b.is_success&&(a.allfans=b.fans)}),a.page={},a.init=function(c){return 0==c||c-1==a.page.page_num?!1:(a.page.current_page=c,void b({url:f+"/shop/"+e+"/fans?offset="+String(10*(c-1))+"&limit=10",method:"GET"}).success(function(b){if(b.is_success){a.fans=b.fans,a.page.total_num=b.total_num,a.page.page_num=Math.ceil(a.page.total_num/10),a.page.plist_all=new Array(a.page.page_num);for(var c=0;c<a.page.plist_all.length;c++)a.page.plist_all[c]=c+1;if(a.page.page_num<5){a.page.plist=new Array(a.page.page_num);for(var c=0;c<a.page.plist.length;c++)a.page.plist[c]=c+1}else{a.page.plist=new Array(5);for(var c=0;5>c;c++)a.page.plist[c]=c+1;if(a.page.current_page>a.page.plist[4])if(a.page.current_page<a.page.page_num-1)for(var c=0;5>c;c++)a.page.plist[c]=a.page.plist[c]+a.page.current_page-a.page.plist[4]+2;else if(a.page.current_page<a.page.page_num)for(var c=0;5>c;c++)a.page.plist[c]=a.page.plist[c]+a.page.current_page-a.page.plist[4]+1;else for(var c=0;5>c;c++)a.page.plist[c]=a.page.plist[c]+a.page.current_page-a.page.plist[4]}}}))},a.init(1),a.is_current=function(b){return b==a.page.current_page?!0:!1},a.drop_g_down=function(b){a.$broadcast("drop_g_down",b),a.show.should_i_show=3}}]),b.controller("fanMsg",["$scope","$http","$rootScope","$sce","$modal","hascookie",function(a,b,c,d,e,f){var g=c.globals.shop_id,h=c.proxyUrl,i=c.chatProxyUrl;a.$on("drop_down",function(b,c){a.fan=c,a.show.should_i_show=2}),a.$on("delect",function(b,c){a.show.should_i_show=1}),a.drop_up=function(){a.show.should_i_show=1,a.$emit("drop_up",null)},a.disable=!0,document.domain=c.hostname,a.editorOptions={filebrowserImageUploadUrl:i+"/ck/file/uploader"},a.isAvailableSend=function(){$.ajax({url:h+"/merchant/"+g+"/msgconfig",async:!1,type:"GET"}).success(function(b){a.disable=!0,a.msgconfig=b,a.msgconfig.p2p_remain_count>0&&(a.disable=!1),a.ckcontent_holder="本月粉丝点对点消息已发送"+String(a.msgconfig.current_p2p_count-a.msgconfig.p2p_remain_count)+"条, 还可以发送"+String(a.msgconfig.p2p_remain_count)+"条"})},a.isAvailableSend();var j=function(){a.shop_id=g;var b=e.open({animation:!0,templateUrl:"views/merchant/account/fans/info.html",controller:["$scope","$modalInstance","$http","shop_id",function(a,b,c,d){a._confirm=function(){b.close()}}],resolve:{shop_id:function(){return a.shop_id}},size:"sm",windowClass:"pub-window",backdropClass:"modal-backdrop"});b.result.then(function(){})};a.send=function(){if(f.check("mt")){var c=i+"/chat/"+String(g)+"/fans/message/?uid="+String(a.fan.user_id);b({url:c,method:"POST",data:a.ckcontent}).success(function(b){a.isAvailableSend(),j(),a.Content=""}),b({url:h+"/shop/"+g+"/fansmessage",data:{sendall:!1,userids:String(a.fan.user_id),message:a.ckcontent},method:"POST"}).success(function(a){})}a.isAvailableSend()}}]),b.controller("focusG",["$scope","$http","$rootScope","$sce","hascookie",function(a,b,c,d,e){var f=c.globals.shop_id,g=c.proxyUrl;a.$on("drop_g_down",function(c,d){a.fan=d,a.show.should_i_show=3,b({url:g+"/customer/"+String(a.fan.user_id)+"/shop/"+f+"/info",method:"get"}).success(function(b){a.fan_all_info=b})})}]),b.controller("sendall",["$scope","$http","$rootScope","$sce","$modal","hascookie",function(a,b,c,d,e,f){var g=c.globals.shop_id,h=c.proxyUrl,i=c.chatProxyUrl;a.disable=!0,document.domain=c.hostname,a.editorOptions={filebrowserImageUploadUrl:"http://"+c._chatProxyUrl+"/ck/file/uploader",allowedContent:!0,entities:!1},a.isAvailableSend=function(){$.ajax({url:h+"/merchant/"+g+"/msgconfig",async:!1,type:"GET"}).success(function(b){$("#hidden_div").removeClass("hidden"),a.msgconfig=b,a.disable=!0,a.msgconfig.mass_remain_count>0&&(a.page.total_num>0||(a.disable=!1)),a.ckcontent_holder="本月粉丝群发消息已发送"+String(a.msgconfig.current_mass_count-a.msgconfig.mass_remain_count)+"条, 还可以发送"+String(a.msgconfig.mass_remain_count)+"条"})},a.isAvailableSend();var j=function(){a.shop_id=g;var b=e.open({animation:!0,templateUrl:"views/merchant/account/fans/info.html",controller:["$scope","$modalInstance","$http","shop_id",function(a,b,c,d){a._confirm=function(){b.close()}}],resolve:{shop_id:function(){return a.shop_id}},size:"sm",windowClass:"pub-window",backdropClass:"modal-backdrop"});b.result.then(function(){})};a.send=function(){if(f.check("mt")){for(var c="",d="",e=0;e<a.allfans.length;e++)c+="uid="+String(a.allfans[e].user_id)+"&",d+=String(a.allfans[e].user_id)+",";var k=i+"/chat/"+String(g)+"/fans/message/?"+c;b({url:k,method:"POST",data:a.ckcontent}).success(function(b){a.isAvailableSend(),j(),a.content=""}),b({url:h+"/shop/"+g+"/fansmessage",data:{sendall:!0,userids:d,message:a.ckcontent},method:"POST"}).success(function(a){})}},a.isAvailableSend()}])});