"use strict";define(["angular","app","directives/ngthumb","directives/doimg","services/checkcookie"],function(a,b){b.controller("goodsCtrl",["$scope","$rootScope","$http","$filter","$timeout","FileUploader","$modal","hascookie",function(b,c,d,e,f,g,h,i){document.title="商品 -喵喵熊";var j=c.hostname,k=c.proxyUrl,l=c.chatProxyUrl,m=c.globals.shop_id;b.curSubnav="online",b.goodsTpl="views/merchant/account/goods/online.html",b.modSubnav=function(a){return i.check("mt")?(b.searchInput="",n="",b.page={},b.page.plist_all=[1],b.page.plist=[],b.page.curPage=b.page.plist_all[0],b.showDetail=!1,b._showDetail=!1,this.val=a.target.attributes.data.value,b.curSubnav=this.val,"online"==this.val?b.init(1,1):"offline"==this.val&&b.init(1,0),void(b.goodsTpl="views/merchant/account/goods/"+this.val+".html")):void console.log("cookieeeeeeeeeeee")},b.$on("modelChange",function(a,c){console.log("child,"+c),b.curSubnav="online",b.init(1,1),b.goodsTpl="views/merchant/account/goods/online.html"}),b.page={},b.page.plist_all=[1],b.page.curPage=b.page.plist_all[0],b.init=function(c,f){if(i.check("mt")){var g="";if(console.log("come"),0==c||c-1==b.page.page_num)return!1;g=n?k+"/goods/search?shop_id="+m+"&offset="+String(10*(c-1))+"&limit=10&status="+f+"&input="+n:k+"/goods?shop_id="+m+"&offset="+String(10*(c-1))+"&limit=10&status="+f,b.goodsCheckedList=[],b.page.current_page=c,d({url:g,method:"GET"}).success(function(d){b.page.curPage=c,b.goods=d.goods,a.forEach(b.goods,function(a,c){b.goods[c].price=b.goods[c].price?e("currency")(b.goods[c].price,"￥"):"-",b.goods[c].promotion_price=b.goods[c].promotion_price?e("currency")(b.goods[c].promotion_price,"￥"):"-"}),console.log("goods,"+b.goods.length),b.page.total_num=d.total_num,b.page.page_num=Math.ceil(b.page.total_num/10),b.page.plist_all=new Array(b.page.page_num);for(var f=0;f<b.page.plist_all.length;f++)b.page.plist_all[f]=f+1;if(b.page.page_num<5){b.page.plist=new Array(b.page.page_num);for(var f=0;f<b.page.plist.length;f++)b.page.plist[f]=f+1}else{b.page.plist=new Array(5);for(var f=0;5>f;f++)b.page.plist[f]=f+1;if(b.page.current_page>b.page.plist[4])if(b.page.current_page<b.page.page_num-1)for(var f=0;5>f;f++)b.page.plist[f]=b.page.plist[f]+b.page.current_page-b.page.plist[4]+2;else if(b.page.current_page<b.page.page_num)for(var f=0;5>f;f++)b.page.plist[f]=b.page.plist[f]+b.page.current_page-b.page.plist[4]+1;else for(var f=0;5>f;f++)b.page.plist[f]=b.page.plist[f]+b.page.current_page-b.page.plist[4]}console.log(b.page)})}},b.init(1,1),b.is_current=function(a){return a==b.page.current_page?!0:!1};var n="";b.searchGoods=function(){if(i.check("mt")){var a=0;"publish"!=b.curSubnav&&(a="online"==b.curSubnav?1:0,b.searchInput?(console.log("search,"+typeof b.searchInput+":"+b.searchInput),n=b.searchInput,b.init(1,a)):(n="",b.init(1,a)))}},b.paging=function(a){return i.check("mt")?(console.log("paginggggggggggggggg,"+b.page.plist_all.length),-1==b.page.plist_all.indexOf(parseInt(b.page.pageNum))?(console.log("noneeeeeeeeeeeeee"),b.page.pageNum="",!1):void b.init(b.page.pageNum,a)):void 0};var o=function(a,c,e,f){var g=k+"/goods/status";a=a.toString();var i=h.open({animation:!0,templateUrl:"views/merchant/account/goods/tpl/confirm.html",controller:["$scope","$modalInstance","$http","msg",function(a,b,c,d){a.msg=d,a._confirm=function(){b.close()},a._cancel=function(){b.dismiss("cancel")}}],resolve:{msg:function(){return c}},size:"sm",windowClass:"modal-window"});i.result.then(function(){d({url:g,method:"PUT",data:{ids:a,status:f}}).success(function(a){a.is_success&&(b.init(b.page.current_page,e),b.backList(e))}).error(function(a){})})};b.offGoods=function(a){if(i.check("mt")){var b="确定下架此商品吗?";o(a,b,1,0)}},b.onGoods=function(a){if(i.check("mt")){var b="确定上架此商品吗?";o(a,b,0,1)}},b.delGoods=function(a,b){if(i.check("mt")){var c="确定删除此商品吗?";o(a,c,b,2)}},b.goodsCheckedList=[],b.toggleSel=function(a){if(i.check("mt")){var c=b.goodsCheckedList.indexOf(a);c>-1?b.goodsCheckedList.splice(c,1):b.goodsCheckedList.push(a),console.log("goodsCheckedList length,"+b.goodsCheckedList.length)}},b.toggleAll=function(){if(i.check("mt"))if(b.goodsCheckedList.length!=b.goods.length)for(var a=0,c=b.goods.length;c>a;a++)b.goodsCheckedList[a]=b.goods[a].goods_id;else b.goodsCheckedList=[]},b.offBatchGoods=function(){if(i.check("mt")){var a="确定要下架所选商品吗?",c=b.goodsCheckedList;o(c,a,1,0)}},b.onBatchGoods=function(){if(i.check("mt")){var a="确定要上架所选商品吗?",c=b.goodsCheckedList;o(c,a,0,1)}},b.delBatchGoods=function(a){if(i.check("mt")){var c="确定要删除所选商品吗?",d=b.goodsCheckedList;o(d,c,a,2)}},b.detailTpl="views/merchant/account/goods/detail/basicInfo.html",b.curDetail="basic",b.goodsInfo={},b.edit="",b.txFocus=function(a){if(i.check("mt")){var c=a.target.attributes.data.value;f(function(){b.edit=c},300)}},b.txBlur=function(){i.check("mt")&&(console.log("blurrrrrrrrrrrr"),f(function(){b.edit=""},200))},b.saveBasic=function(c,g){if(i.check("mt")){var h=c.target.attributes.data.value;console.log("vallllllllll,"+h);var j={shop_id:m};j[h]=g,d({url:k+"/goods/"+b.goodsInfo.goods_id,method:"PUT",data:a.toJson(j)}).success(function(a){a.is_success?(b.saveInfo="保存成功",b.saved=h,f(function(){b.saved=""},2e3),b.goodsInfo[h]="price"===h||"promotion_price"===h?e("currency")(b.goodsBasic[h],"￥"):b.goodsBasic[h],console.log("change success")):(b.saveInfo="保存失败",b.saved=h,f(function(){b.saved=""},2e3),p(b.goodsInfo.goods_id))}).error(function(a){console.log("save failed"),b.saveInfo="保存失败",b.saved=h,f(function(){b.saved=""},2e3),p(b.goodsInfo.goods_id)})}};var p=function(c){console.log("goods_id,"+c),d.get(k+"/goods/"+c).success(function(c){b.goodsBasic=c,a.forEach(b.goodsBasic,function(a,c){a||"basic_info"===c||(b.goodsBasic[c]="-")}),a.fromJson(b.goodsBasic.basic_info).length?(console.log("$scope.goodsBasic.basic_info.length,"+a.fromJson(b.goodsBasic.basic_info).length),b.goodsBasic.basic_info=a.fromJson(b.goodsBasic.basic_info),console.log("basic_info,"+b.goodsBasic.basic_info[0].paramsName)):b.goodsBasic.basic_info=[]}).error(function(a){console.log("data,"+a)})},q=function(a){var c=k+"/goods/"+a+"/image";d.get(c).success(function(a){b.imgInfo=a}).error(function(a){}),console.log("goods_id,"+a)},r=b.uploader=new g({url:l+"/file/uploader",autoUpload:!0});r.filters.push({name:"imageFilter",fn:function(a,b){var c="|"+a.type.slice(a.type.lastIndexOf("/")+1)+"|";return-1!=="|jpg|png|jpeg|bmp|gif|".indexOf(c)}}),r._onSuccessItem=function(a,c,e,f){r.queue.splice(0,1),console.log("successuploadddddd,"+c.url);var g=k+"/goods/"+b.goodsInfo.goods_id+"/image";if(c.url){b.imgInfo.imgs.unshift(c.url);var h=b.imgInfo.imgs.toString(),i={pic_url_list:h};d({url:g,method:"PUT",data:i}).success(function(a){a.is_success&&console.log("upload success")}).error(function(){})}},r._onErrorItem=function(){console.log("erroruploadddddd")};var s=0;b.large=!1,b.largeSrc="",b.enlarge=function(a,c){console.log("large"),b.noLast=!1,b.noNext=!1,0==c&&(b.noLast=!0),c==b.imgInfo.imgs.length-1&&(b.noNext=!0),s=c,b.large=!0,b.largeSrc=a+"@650w_650h_0e_1l"},b.lastImg=function(){return console.log("index,"+s),b.noLast?!1:(s-=1,0==s&&(b.noLast=!0),b.noNext=!1,void(b.largeSrc=b.imgInfo.imgs[s]+"@650w_650h_0e_1l"))},b.nextImg=function(){return console.log("index,"+s),b.noNext?!1:(s+=1,s==b.imgInfo.imgs.length-1&&(b.noNext=!0),b.noLast=!1,void(b.largeSrc=b.imgInfo.imgs[s]+"@650w_650h_0e_1l"))},b.closeLarge=function(){b.large=!1};var t=function(a,c,e){var f=h.open({animation:!0,templateUrl:"views/merchant/account/goods/tpl/confirm.html",controller:["$scope","$modalInstance","msg",function(a,b,c){a.msg=c,a._confirm=function(){b.close()},a._cancel=function(){b.dismiss("cancel")}}],resolve:{msg:function(){return e}},size:"sm",windowClass:"modal-window"});f.result.then(function(){b.imgInfo.imgs.splice(a,1);var e=b.imgInfo.imgs.toString(),f={pic_url_list:e};d({url:c,method:"PUT",data:f}).success(function(a){a.is_success&&console.log("del success")}).error(function(){})})};b.delImg=function(a){if(i.check("mt")){var c=k+"/goods/"+b.goodsInfo.goods_id+"/image",d="确定删除此图片吗?";t(a,c,d)}},b.attention={},b.fansInfo={},b.maxNum=8,b.isPackUp=!0,b.curFans=0,b.showAll=function(){console.log("fans_total,"+b.fansInfo.total_num),b.maxNum=b.fansInfo.total_num,b.isPackUp=!1},b.showFansData=function(a){i.check("mt")&&(w(a),b.curFans=b.fansInfo.fans[a])},b.hideFansData=function(){b.curFans=0},b.packUp=function(){b.maxNum=8,b.isPackUp=!0},b.curPage=0,b.noLast=!1,b.noNext=!1;var u=function(a){v(a,1,9)},v=function(a,c,e){var f=9*(c-1);d.get(k+"/goods/"+a+"/fans?details="+!0+"&offset="+f+"&limit="+e).success(function(a){b.fansInfo=a,b.curPage=c,1==b.curPage?(console.log("curPage111"),b.noLast=!0,b.curPage*e>=b.fansInfo.total_num?(console.log("next"),b.noNext=!0):b.noNext=!1):(console.log("curPage"),b.noLast=!1,b.curPage*e>=b.fansInfo.total_num?(console.log("no next"),b.noNext=!0):b.noNext=!1);for(var d=0,f=b.fansInfo.fans.length;f>d;d++)b.fansInfo.fans[d].last_visit_time=b.fansInfo.fans[d].last_visit_time.split(" ")[0]}).error(function(a){console.log("data,"+a)})};b.lastPage=function(){if(i.check("mt")&&!b.noLast){var a=b.curPage-1;v(b.goodsInfo.goods_id,a,9)}},b.nextPage=function(){if(i.check("mt")&&!b.noNext){var a=b.curPage+1;v(b.goodsInfo.goods_id,a,9)}};var w=function(a){var c=k+"/customer/"+b.fansInfo.fans[a]+"/shop/"+m+"/info";d.get(c).success(function(a){b.fansData=a,b.fansData.last_visit_time=b.fansData.last_visit_time.split(" ")[0],console.log(b.fansData.last_visit_time)}).error(function(a){})},x=function(a){var c=k+"/goods/"+a+"/fans?details=0";d.get(c).success(function(a){b.fansIds=a.fans,b.emptyFans=0==a.total_num?!0:!1})};b.sendMsg={};var y=function(){var a=k+"/merchant/"+m+"/msgconfig";$.ajax({url:a,type:"GET"}).success(function(a){b.totalCnt=a.current_mass_count,b.remainCnt=a.mass_remain_count,b.sentCnt=b.totalCnt-b.remainCnt,b.sendMsg.remind="本月粉丝群发消息已发送"+b.sentCnt+"条,还可以发送"+b.remainCnt+"条"}).error(function(){})};document.domain=j,b.editorOptions={filebrowserImageUploadUrl:l+"/ck/file/uploader",filebrowserUploadUrl:"",filebrowserBrowseUrl:""},b.descRemain=function(){if(i.check("mt")){var a=k+"/merchant/"+m+"/msgconfig",b={type:"desc_remain",cate:"mass"};d({url:a,method:"PUT",data:b}).success(function(a){console.log("msgconfig,"+a)})}};var z=function(a){h.open({animation:!0,templateUrl:"views/merchant/account/goods/tpl/alert.html",controller:["$scope","$modalInstance","msg",function(a,b,c){a.msg=c,a.ok=function(){b.close()}}],resolve:{msg:function(){return a}},size:"sm",windowClass:"modal-window"})};b.sendNotice=function(){if(i.check("mt")){var a=l+"/chat/"+m+"/fans/message?",c=k+"/shop/"+m+"/fansmessage",e=b.fansIds,f="";a+="uid="+e[0];for(var g=1,h=e.length;h>g;g++)a=a+"&uid="+e[g];d({url:a,method:"POST",data:b.sendMsg.letter}).success(function(a){a.error?(f="消息发送失败!",z(f)):(d({url:c,method:"POST",data:{userids:e.toString(),message:b.sendMsg.letter,sendall:!0}}).success(function(a){a.is_success&&(y(),b.sendMsg.letter="",console.log("post msgUrl success"))}),f="消息发送成功!",z(f))})}},b.showBasic=function(a){i.check("mt")&&(b.curDetail="basic",p(a),b.detailTpl="views/merchant/account/goods/detail/basicInfo.html")},b.showImg=function(a){i.check("mt")&&(b.curDetail="image",q(a),b.detailTpl="views/merchant/account/goods/detail/image.html")},b.showAttention=function(a){i.check("mt")&&(u(a),b.curDetail="attention",b.detailTpl="views/merchant/account/goods/detail/attention.html")},b.showMessage=function(a){i.check("mt")&&(y(),x(a),b.curDetail="message",b.detailTpl="views/merchant/account/goods/detail/message.html")},b.showDetail=!1,b._showDetail=!1,b.getDetail=function(a,c){i.check("mt")&&(b.showBasic(a.goods_id),1==c?b.showDetail=!0:b._showDetail=!0,b.goodsInfo=a)},b.backList=function(a){i.check("mt")&&(1==a?b.showDetail=!1:b._showDetail=!1)}}]),b.controller("goodsPublish",["$scope","$rootScope","$http","$location","$timeout","$modal","FileUploader","hascookie",function(b,c,d,e,f,g,h,i){var j=b.goods={},k=c.hostname,l=c.proxyUrl,m=c.chatProxyUrl,n=c.globals.shop_id;!function(){console.log("get fansnum"),d({url:l+"/shop/"+n+"/fans?offset=0&limit=1",method:"GET"}).success(function(a){b.fansNum=a.total_num,console.log("fansNum,"+b.fansNum)})}(),b.getCategories=function(){if(i.check("mt")){var a=l+"/basic/goodscategories?type=all_tree";d.get(a).success(function(a){a.goodscategories&&(j._categoryInfo=a.goodscategories,j.initData())}).error(function(){})}},b.getCategories(),j.initData=function(){var a=0,c=0;d({url:l+"/shop/"+n,method:"GET"}).success(function(d){a=d.category_list[0];a:for(var e=0,f=j._categoryInfo.length;f>e;e++)for(var g=0,h=j._categoryInfo[e].son.length;h>g;g++)if(console.log("id,"+j._categoryInfo[e].son[g].id),a==j._categoryInfo[e].son[g].id){console.log("get category,"+g),c=g,j.category=j._categoryInfo[e],j.subcategory=j.category.son[g];break a}b.$watch("goods.category",function(a){j.subcategory=j.category.son[c]})}),j.templateUrl="views/merchant/account/goods/categories/goods_info.html"},j.categoryChange=function(){},j.params=[],j.info={shop_id:"",category_id:"",description:"",detail:"",bar_code:"",brand_name:"",price:"",promotion_price:"",pic_url_list:"",remark:"",basic_info:j.params},j.basicInfo={},j.basicInfo.imgList=[];var o=b.uploader=new h({url:m+"/file/uploader",autoUpload:!0});o.filters.push({name:"imageFilter",fn:function(a,b){var c="|"+a.type.slice(a.type.lastIndexOf("/")+1)+"|";return-1!=="|jpg|png|jpeg|bmp|gif|".indexOf(c)}}),o._onSuccessItem=function(a,b,c,d){o.queue.splice(0,1),b.url&&(console.log("upload image success"),j.basicInfo.imgList.push(b.url))},j.delImg=function(a){i.check("mt")&&j.basicInfo.imgList.splice(a,1)};var p=function(){b.shop_id=n;var a=g.open({animation:!0,templateUrl:"views/merchant/account/goods/tpl/pubDialog.html",controller:["$scope","$modalInstance","$http","shop_id","fansNum",function(a,b,c,d,e){a.notice=!0,a.rest=!0,a.cb=!0,a.shop_id=d,a.fansNum=e;var f=l+"/merchant/"+a.shop_id+"/msgconfig";c.get(f).success(function(b){a.restNum=b.mass_remain_count,(a.restNum<=0||0==a.fansNum)&&(console.log("notice false"),a.cb=!1,a.rest=!1,a.notice=!1),a.postedNum=b.current_mass_count-b.mass_remain_count}).error(function(a){}),a._confirm=function(){b.close(a.notice)},a._cancel=function(){b.dismiss("cancel")}}],resolve:{shop_id:function(){return b.shop_id},fansNum:function(){return b.fansNum}},size:"sm",windowClass:"modal-window",backdropClass:"modal-backdrop"});a.result.then(function(a){b.notice=a,console.log("notice",b.notice),q()})};j.postComm=function(){i.check("mt")&&p()},j.legalPrice=!0,j.priceRight=!0,j.legalProPrice=!0,j.proPriceRight=!0,j.checkPrice=function(){console.log(j.basicInfo.price),console.log("price blur"),j.basicInfo.price&&(console.log("has price"),j.basicInfo.proPrice?j.legalProPrice&&(j.basicInfo.price<j.basicInfo.proPrice?(console.log("price err"),j.priceRight=!1):(console.log("price right"),j.priceRight=!0,j.proPriceRight=!0)):(console.log("no pro"),j.priceRight=!0,a.isNumber(j.basicInfo.price)&&j.basicInfo.price>0?(console.log("legalPrice"),j.legalPrice=!0):(console.log("ilegalprice"),j.legalPrice=!1)))},j.checkProPrice=function(){console.log("proprice blur,"+j.basicInfo.proPrice),j.basicInfo.proPrice&&(j.basicInfo.price?j.legalPrice&&(j.basicInfo.price<j.basicInfo.proPrice?j.proPriceRight=!1:(j.proPriceRight=!0,j.priceRight=!0)):(j.proPriceRight=!0,j.legalProPrice=a.isNumber(j.basicInfo.proPrice)&&j.basicInfo.proPrice>0?!0:!1))},j.checkData=function(a,b){if(b){var c={paramsName:a,paramsValue:b};j.params.push(c)}},j.fillData=function(){j.info={shop_id:n,category_id:j.subcategory.id,description:j.basicInfo.name,detail:j.basicInfo.detail,bar_code:j.basicInfo.barcode,brand_name:j.basicInfo.brandName,price:j.basicInfo.price,promotion_price:j.basicInfo.proPrice,pic_url_list:j.basicInfo.imgList.toString(),remark:j.basicInfo.remark,basic_info:a.toJson(j.params),is_sendall:b.notice}},j.clearData=function(){j.basicInfo={},j.basicInfo.imgList=[]};var q=function(){if(i.check("mt")){var a=l+"/goods";j.checkData(j.remarkName,j.remark),j.fillData(),d({method:"POST",url:a,data:j.info}).success(function(a){a.is_success&&(console.log("goods_id,"+a.goods_id),r()),j.clearData()}).error(function(a){j.clearData()})}};j.cancelPublish=function(){r(),j.clearData()};var r=function(){var a="change";b.$emit("modelChange",a)};document.domain=k,b.editorOptions={filebrowserImageUploadUrl:m+"/ck/file/uploader",filebrowserUploadUrl:"",filebrowserBrowseUrl:"",extraPlugins:"placeholder"}}])});