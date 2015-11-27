
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

define(['angular', 'app','services/ucmsgdata','services/checkcookie'], function (angular, app) {
    app.controller('messageCtrl', ['$scope', '$rootScope', '$http','$window', '$timeout','$q','ucmsgdata','$sce','hascookie',
	function ($scope, $rootScope, $http,$window,$timeout,$q,ucmsgdata,$sce,hascookie) {	
	document.title = "通知消息 -喵喵熊";
	var host = $rootScope.proxyUrl;
	var userid=$rootScope.globals.userID;
	var user = $scope.user = {};
	$scope.nomsg=true;

			var data=$scope.data=ucmsgdata.data;
			//去除重复的数据---------------start-----------------旧消息处理过新消息就显示不出来，而且存在点消息按钮，列表不刷新，必须先点下其他模块，这就需要把处理的代码放到李那边，交给他先处理
			/*
			var a=ucmsgdata.data;
			var add=[];
			var refuse=[];
			var sendshop=[];
			for(var i=0;i<a.length;i++){
				if(a[i].c=="CON_FRIEND"){refuse.splice(-1,0,a[i])};
				if(a[i].c=='ADD_FRIEND'){add.splice(-1,0,a[i])};
				if(a[i].c=='SEND_FANS_M'){sendshop.splice(-1,0,a[i])};
			}
			for(var i=0;i<add.length;i++) {
					for(var j=i+1;j<add.length;j++) {
						if(add[i].name===add[j].name) {
							add.splice(j,1);
							j--;
						}
					}
			}
			for(var i=0;i<refuse.length;i++) {
					for(var j=i+1;j<refuse.length;j++) {
						if(refuse[i].name===refuse[j].name) {
							refuse.splice(j,1);
							j--;
						}
					}
			}
	
			var data=$scope.data=add.concat(refuse,sendshop);
			//console.log(data);
			*/
			/* //别人写的简便的方法
			function delSame(arr,c){//假设c为'add'
			var tempArr=[];
			if(arr&&arr instanceof Array){

				for(var i=0,len = arr.length;i<len;i++){

					if(arr[i].c == c && tempArr.length > 0){
							for(var j=0,jlen = tempArr.length;j<jlen;j++){
								if(tempArr[j].name == arr[i].name && tempArr[j].c == c){
									break;//临时数组已有该用户数据,不再检查arr[i]
								}
								if(j == jlen - 1){//如果一直检查到tempArr最后一个值还未相同,则推入该值

									tempArr.push(arr[i]);
								}
							}

					}else{
						tempArr.push(arr[i]);//此时循环到的c值是非'add'，即'refuse',不动它
					}
					
				}
				return tempArr;

			}else{
				return false;
			}
		}

			*/
			//去除重复的数据---------------end-----------------
			var temp = [];
			function loadMSG() {
			if(data.length>0){
				$scope.msgshow=true;
				$scope.nomsg=false;	
				for(var i=0;i<data.length;i++){
					if(data[i].c === "SEND_FANS_M"){
						temp.push(i);
						$http.get(host+'/shop/'+data[i].shop).success(function(res){
								var reslist={name:res.shop_name,pic:res.pic_url_list[0]};
								var j=temp.splice(0,1);
								for(var x in reslist){data[j][x]=reslist[x];}
							}							
						)
						data[i].body1=data[i].body.replace(/<img([\d\D]*?)\/>/ig, "[ 图片 ]"); 
						if(data[i].body1=='<br>[ 图片 ]'){data[i].body1='[ 图片 ]'};
						//html宽度控制开始
							var m_info_width=720;
							var html = data[i].body;
							var re = new RegExp("width:(.*?)px; height:(.*?)px", ["g"]);
							var res;
							while (res = re.exec(html)) {
								if (res[1] > m_info_width) {
									var nw = m_info_width;
									var nh = res[2] * m_info_width / res[1];
									html = html.replace(res[0], "height:" + String(nh) + "px; width:" + String(nw) + "px");
								}
							}
							data[i].body2 = $sce.trustAsHtml(html);
							//html宽度控制结束	
					}
								
				}
			}
			}
			loadMSG();
			$scope.$on('reloadMsg',function(evt,msg) {
				if(hascookie.check('cm')) {	
					loadMSG();
					$scope.shopmsgshow=false;
				}
			});
		$scope.msglist=data;
		$scope.aggree=function(id,index){
			if(hascookie.check('cm')) {
				$http.post(host+'/user/friend/accept?uid='+id+'&accept=1').success(function(data){});
				$scope.msglist[index].add1=true;
				$scope.msglist[index].add2=true;
				$scope.msglist[index].buttons=true;
			}	
		}
		
		$scope.refuse=function(id,index){
			if(hascookie.check('cm')) {
				$http.post(host+'/user/friend/accept?uid='+id+'&accept=0').success(function(data){});	
				$scope.msglist[index].add1=true;
				$scope.msglist[index].add3=true;
				$scope.msglist[index].buttons=true;
			}	
		}	
		user.openshopmsg=function(html,shopname,shopid,time,index){
			if(hascookie.check('cm')) {
				 user.scrollTop = $(window).scrollTop();
					_loadShopmsg();
					
					$timeout(function() {
						bcInfoShop(html,shopname,shopid,time,index);
					},300);
			}		
		}	
		var _loadShopmsg = function() {
                var shopmsgctrl = ['../views/customer/account/message/shopmsg/shopmsgCtrl'];
                var deferred = $q.defer();
                require(shopmsgctrl,function() {
                    $rootScope.$apply(function() {
                        deferred.resolve();        
                    });
                });
                deferred.promise.then(function(res) {
                    $scope.msgshow = false;
					$scope.shopmsgshow=true;	
                });        
            };	
		var bcInfoShop = function(html,shopname,shopid,time,index) {
                    var _shop = {shopid:shopid,shopname:shopname,index:index,scrollTop:user.scrollTop,time:time,html:html};    
                $scope.$broadcast('openshopmsg',_shop);        
            };	
		$scope.$on('closeshopmsg',function(evt,msg) {
			
               $scope.msgshow = true;
			   $scope.shopmsgshow=false;
                $timeout(function() {
                    $window.scrollTo(0,msg.scrollTop);
                },100);
			
		});

	}])
	
})