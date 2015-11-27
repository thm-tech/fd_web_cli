define(['angular', 'app','qrcode', 'qrcodeUTF8'], function (angular, app) {
    app.controller('CollectCtrl', ['$scope', '$rootScope', '$http', '$window',function ($scope, $rootScope, $http,$window) {	
	var host = $rootScope.proxyUrl;
	var userid=$rootScope.globals.userID;
	var collecturl=host+'/userweb/'+userid+'/favorites';
	var user = $scope.user = {};
	user.allcolData = [];
	var getlist=function(offset,limit){
		$http({
		url:collecturl,
		method:'GET',
		params:{
			'limit':limit,
			'offset':offset,
				}
		})
		.success(function(goodslist){
		user.allcolData = user.allcolData.concat(goodslist.goods);
		$scope.goodslist=goodslist.goods=user.allcolData;
		$scope.toggle1=function(index,id){
			$scope.goodslist[index].ifshow=$scope.goodslist[index].ifshow?false:true;
			$http.delete(host+'/user/goods/concern?gid='+id).success(function(res){})
		}
		$scope.toggle2=function(index,id){
			$scope.goodslist[index].ifshow=$scope.goodslist[index].ifshow?false:true;	
			$http.post(host+'/user/goods/concern?gid='+id).success(function(res){})
		}
		
		$scope.sqq=function(sid){
			var p = {
			url:'https://www.baidu.com/', /*获取URL，可加上来自分享到QQ标识，方便统计*/
			desc:'', /*分享理由(风格应模拟用户对话),支持多分享语随机展现（使用|分隔）*/
			title:'', /*分享标题(可选)*/
			summary:'', /*分享摘要(可选)*/
			pics:'', /*分享图片(可选)*/
			flash: '', /*视频地址(可选)*/
			site:'', /*分享来源(可选) 如：QQ分享*/
			style:'202',
			width:24,
			height:24
			};
			var s = [];
			for(var i in p){
			s.push(i + '=' + encodeURIComponent(p[i]||''));
			}
			$scope.sqqhref="http://connect.qq.com/widget/shareqq/index.html?"+s.join('&');
			}
		
		$scope.tsina=function(sid){
			var param = {
			url:'https://www.baidu.com/',
			type:'3',
			count:'0', /**是否显示分享数，1显示(可选)*/
			appkey:'', /**您申请的应用appkey,显示分享来源(可选)*/
			title:'', /**分享的文字内容(可选，默认为所在页面的title)*/
			pic:'', /**分享图片的路径(可选)*/
			ralateUid:'', /**关联用户的UID，分享微博会@该用户(可选)*/
			language:'zh_cn', /**设置语言，zh_cn|zh_tw(可选)*/
			rnd:new Date().valueOf()
		  }
		  var temp = [];
		  for( var p in param ){
			temp.push(p + '=' + encodeURIComponent( param[p] || '' ) )
		  }
		  $scope.tsinahref='http://service.weibo.com/share/share.php?'+temp.join('&');
	
		}
		$scope.qzone=function(sid){
			var p = {
				url:location.href,
				showcount:'0',/*是否显示分享总数,显示：'1'，不显示：'0' */
				desc:'',/*默认分享理由(可选)*/
				summary:'',/*分享摘要(可选)*/
				title:'',/*分享标题(可选)*/
				site:'',/*分享来源 如：腾讯网(可选)*/
				pics:'', /*分享图片的路径(可选)*/
				style:'203',
				width:98,
				height:22
				};
			var s = [];
			for(var i in p){
			s.push(i + '=' + encodeURIComponent(p[i]||''));
			}
			$scope.qzonehref='http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?'+s.join('&');			
			
		}
		
		})
	};
			getlist(0,10);
            var maxNum = 20; //最大加载次数
            var range = 50; //距离下边界50px
            var num = 1;
            var totalHeight = 0;

            $window.onscroll = function() {
                var scrollPos = $(window).scrollTop();
                var docHeight = $(document).height();
                var winHeight = $(window).height();  
                totalHeight = parseFloat(winHeight) + parseFloat(scrollPos);
                if(docHeight - range <= totalHeight && user.allcolData.length != 0 && num != maxNum) {
                    var offset = num*10;
                    getlist(offset,10);
                    num++;
                }
            };	
	
	}])
	
})