function changeDateToString(a){if("string"==typeof a)return a;var b=0,c=0,d=0,e="";return b=a.getFullYear(),c=a.getMonth()+1,d=a.getDate(),e=b+"-",e=c>=10?e+c+"-":e+"0"+c+"-",d>=10?e+=d:e=e+"0"+d,e}define(["angular","app","services/checkcookie"],function(angular,app){app.controller("historyActivity",["$scope","$http","$rootScope","$modal","hascookie",function($scope,$http,$rootScope,$modal,hascookie){document.title="活动 -喵喵熊";var shop_id=$scope.shop_id=$rootScope.globals.shop_id,host=$rootScope.proxyUrl,date=new Date,getdate=$scope.getdate=function(strDate){var date=eval("new Date("+strDate.replace(/\d+(?=-[^-]+$)/,function(a){return parseInt(a,10)-1}).match(/\d+/g)+")");return date};$scope.now=new Date,$scope.show={},$scope.show.should_i_show=1,$scope.drop_down=function(a){$scope.$broadcast("drop_down",a),$scope.show.should_i_show=2},$scope.$on("drop_up",function(a,b){$scope.show.should_i_show=1}),$scope.delect=function(a){popDialog(a)},$scope.page={},$scope.page.page_num=999999,$scope.init=function(a){return 0>=a||a>$scope.page.page_num&&1!=a?!1:0==a||a-1==$scope.page.page_num&&1!=a?!1:($scope.page.current_page=a,void $http({url:host+"/shop/"+shop_id+"/activities?offset="+String(10*(a-1))+"&limit=10",method:"GET"}).success(function(a){if(a.is_success){$scope.activities=a.activities,$scope.page.total_num=a.total_num,$scope.page.page_num=Math.ceil($scope.page.total_num/10),$scope.page.plist_all=new Array($scope.page.page_num);for(var b=0;b<$scope.page.plist_all.length;b++)$scope.page.plist_all[b]=b+1;if($scope.page.page_num<5){$scope.page.plist=new Array($scope.page.page_num);for(var b=0;b<$scope.page.plist.length;b++)$scope.page.plist[b]=b+1}else{$scope.page.plist=new Array(5);for(var b=0;5>b;b++)$scope.page.plist[b]=b+1;if($scope.page.current_page>$scope.page.plist[4])if($scope.page.current_page<$scope.page.page_num-1)for(var b=0;5>b;b++)$scope.page.plist[b]=$scope.page.plist[b]+$scope.page.current_page-$scope.page.plist[4]+2;else if($scope.page.current_page<$scope.page.page_num)for(var b=0;5>b;b++)$scope.page.plist[b]=$scope.page.plist[b]+$scope.page.current_page-$scope.page.plist[4]+1;else for(var b=0;5>b;b++)$scope.page.plist[b]=$scope.page.plist[b]+$scope.page.current_page-$scope.page.plist[4]}}console.log($scope.page)}))},$scope.init(1),$scope.is_current=function(a){return a==$scope.page.current_page?!0:!1};var popDialog=function(a){$scope.shop_id=shop_id;var b=$modal.open({animation:!0,templateUrl:"views/merchant/account/activity/confirm.html",controller:["$scope","$modalInstance","$http","shop_id",function(a,b,c,d){a.notice=!0,a.shop_id=d,a._confirm=function(){b.close()},a._cancel=function(){b.dismiss("cancel")}}],resolve:{shop_id:function(){return $scope.shop_id}},size:"sm",windowClass:"pub-window",backdropClass:"modal-backdrop"});b.result.then(function(){$http({url:host+"/shop/"+shop_id+"/activity/"+a,method:"DELETE"}).success(function(a){a.is_success?($scope.show.should_i_show=1,$scope.init($scope.page.current_page),$scope.$broadcast("delect",null)):popInfo()})})},popInfo=function(){$scope.shop_id=shop_id;var a=$modal.open({animation:!0,templateUrl:"views/merchant/account/activity/info.html",controller:["$scope","$modalInstance","$http","shop_id",function(a,b,c,d){a._confirm=function(){b.close()}}],resolve:{shop_id:function(){return $scope.shop_id}},size:"sm",windowClass:"pub-window",backdropClass:"modal-backdrop"});a.result.then(function(){})}}]),app.controller("activityInfo",["$scope","$http","$rootScope","$sce",function(a,b,c,d){c.globals.shop_id,c.proxyUrl;a.$on("drop_down",function(b,c){a.activity=c,a.show.should_i_show=2,m_info_width=$(".m_table").width()-42;for(var e=a.activity.act_content,f=new RegExp("height:(.*?)px; width:(.*?)px",["g"]);res=f.exec(e);)if(res[2]>m_info_width){var g=m_info_width,h=res[1]*m_info_width/res[2];e=e.replace(res[0],"height:"+String(h)+"px; width:"+String(g)+"px")}a.activity_html=d.trustAsHtml(e)}),a.$on("delect",function(b,c){a.show.should_i_show=1}),a.drop_up=function(){a.show.should_i_show=1,a.$emit("drop_up",null)}}]),app.controller("postActivity",["$scope","$http","$rootScope","$stateParams","$modal","hascookie",function(a,b,c,d,e,f){var g=c.globals.shop_id,h=c.proxyUrl;a.begin_date=changeDateToString(new Date),a.end_date=a.begin_date,a.minDate=a.minDate?null:new Date,a.return_to_list=function(){a.show.should_i_show=1},a.begin_open=function(b){b.preventDefault(),b.stopPropagation(),a.begin_opened=!0},a.end_open=function(b){b.preventDefault(),b.stopPropagation(),a.end_opened=!0,console.log(a.begin_date,a.end_date)},a.dateOptions={formatYear:"yy",startingDay:1};var i=function(c){var d=e.open({animation:!0,templateUrl:"views/merchant/account/activity/tips.html",controller:["$scope","$modalInstance","$http",function(a,b,c){a._confirm=function(){b.close()},a._cancel=function(){b.dismiss()}}],resolve:{isValid:function(){return c}},size:"sm",windowClass:"pub-window",backdropClass:"modal-backdrop"});d.result.then(function(){b({url:h+"/shop/"+g+"/activities",data:{act_title:a.act_title,act_content:a.act_content+" ",begin_time:changeDateToString(a.begin_date),end_time:changeDateToString(a.end_date)},method:"POST"}).success(function(b){b.is_success?(a.show.should_i_show=1,a.init(1),a.act_title="",a.act_content="",a.returnInfo=""):(a.returnInfo="今天你已经发过活动了",console.log(b,"fail"))}).error(function(){console.log("error")})},function(){})};a.send=function(a){f.check("mt")&&(a?i():alert("请填写所有活动信息"))},document.domain=c.hostname,a.editorOptions={filebrowserImageUploadUrl:"http://"+c._chatProxyUrl+"/ck/file/uploader"}}])});